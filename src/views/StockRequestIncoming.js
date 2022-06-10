import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL, USER_KEY, USER_ROLES} from "../variables/constants";
import INTERCEPTOR from "variables/global/interceptor";
import Memory from "../variables/memory";
import Functions from "../variables/functions";

class StockRequestIncoming extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        stockRequestsUrl: SERVER_URL.concat(`/stock-request`),
        branchesUrl: SERVER_URL.concat(`/branch`),
        stockRequestsTable: {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'From',
                    field: 'byBranchName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'To',
                    field: 'forBranchName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Vehicle',
                    field: 'vehicleReg',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Created',
                    field: 'createdAt',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Updated',
                    field: 'updatedAt',
                    sort: 'asc',
                    width: 150
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
        branches: [<option key='' value=''>(Select a from branch)</option>],
        selectedBranchId: '',
        processing: false
    }

    async componentDidMount() {
        await this.setBranchId();
        this.setStockRequests();
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
                                    <CardTitle tag="h4">Current Stock Requests</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="row container" style={{height: "12vh"}}>
                                        <div className="align-items-start justify-content-start col-6"
                                             style={{marginTop: "10px", display: Functions.getBranchComboVisibility()}}>

                                        </div>
                                    </div>

                                    <div className="container">
                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.stockRequestsTable}
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

    async setStockRequests() {

        const selectedBranchId = this.state.selectedBranchId

        const response = await axios.get(this.state.stockRequestsUrl + `/for-branch/` + selectedBranchId);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
                <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.stockRequestApproveClick}>Approve
                </button>
                <button className="btn btn-danger btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.stockRequestRejectClick}>Reject
                </button>
            </React.Fragment>
            return data;
        });

        this.setState({
            stockRequestsTable: {
                columns: this.state.stockRequestsTable.columns,
                rows: dataWithButton
            }
        });
    }

    handleSelectBranchChange = async ({currentTarget: input}) => {
        let selectedBranchId = input.value;
        await this.setState({selectedBranchId});
        this.setStockRequests();
    }

    stockRequestApproveClick = async (event) => {
        event.preventDefault();
        const selected = JSON.parse(event.target.value);

        const confirm = await Functions.confirmInfoSwal('Yes, approve it!');

        if (!confirm.isConfirmed)
            return;

        await this.sendRequestUpdateApi(selected.id, 'DONE');
    }

    stockRequestRejectClick = async (event) => {
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

    async setBranchId() {
        const userData = Memory.getValue(USER_KEY);
        await this.setState({selectedBranchId: userData.branchId});
    }

    async sendRequestUpdateApi(stockRequestId, status) {
        this.setProcessing(true)

        try {
            const response = await axios
                .patch(this.state.stockRequestsUrl
                    .concat('/').concat(stockRequestId)
                    .concat('/status/').concat(status)
                );
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setStockRequests();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }
}


export default StockRequestIncoming;