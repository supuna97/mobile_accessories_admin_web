import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL, USER_KEY, USER_ROLES} from "../variables/constants";
import INTERCEPTOR from "variables/global/interceptor";
import Memory from "../variables/memory";
import Functions from "../variables/functions";

class OrderResult extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        orderRequestsUrl: SERVER_URL.concat(`/orders`),
        orderRequestsTable: {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Total Amount',
                    field: 'totalAmount',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Order Date',
                    field: 'createdAt',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Customer Name',
                    field: 'customerName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Customer Mobile',
                    field: 'customerMobile',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Agent Name',
                    field: 'salesAgentName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Action',
                    field: 'action',
                    sort: 'asc',
                    width: 200
                }
            ],
            rows: []
        },
        processing: false
    }

    async componentDidMount() {
        await this.setOrderRequests();
    }

    render() {

        return (
            <React.Fragment>
                <PanelHeader size="sm"/>
                <div className="content">
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Current Orders Requests</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className="container">
                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.orderRequestsTable}
                                                        fullPagination
                                                        searchTop searchBottom={false}/>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }

    async setOrderRequests() {
        const response = await axios.get(this.state.orderRequestsUrl);

        const dataWithButton = response.data.data.map(data => {
                data.action = <React.Fragment>
                    <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                            onClick={this.orderRequestApproveClick}>Approve
                    </button>
                    <button className="btn btn-danger btn-sm w-20 ml-1" value={JSON.stringify(data)}
                            onClick={this.orderRequestRejectClick}>Reject
                    </button>
                </React.Fragment>
                return data;
            }
        );

        this.setState({
            orderRequestsTable: {
                columns: this.state.orderRequestsTable.columns,
                rows: dataWithButton
            }
        });
    }

    handleSelectBranchChange = async ({currentTarget: input}) => {
        let selectedBranchId = input.value;
        await this.setState({selectedBranchId});
        this.setOrderRequests();
    }

    orderRequestApproveClick = async (event) => {
        event.preventDefault();
        const selected = JSON.parse(event.target.value);

        const confirm = await Functions.confirmInfoSwal('Yes, approve it!');

        if (!confirm.isConfirmed)
            return;

        await this.sendRequestUpdateApi(selected.id, 'DONE');
    }

    orderRequestRejectClick = async (event) => {
        event.preventDefault();
        const selected = JSON.parse(event.target.value);

        const confirm = await Functions.confirmSwal('Yes, reject it!');

        if (!confirm.isConfirmed)
            return;

        await this.sendRequestUpdateApi(selected.id, 'REJECTED');
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }

    async sendRequestUpdateApi(orderRequestId, status) {
        this.setProcessing(true)

        try {
            const response = await axios
                .patch(this.state.orderRequestsUrl
                    .concat('/').concat(orderRequestId)
                    .concat('/status/').concat(status)
                );
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setOrderRequests();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }
}

export default OrderResult;