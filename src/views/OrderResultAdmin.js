import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL} from "../variables/constants";
import INTERCEPTOR from "variables/global/interceptor";

class OrderResultAdmin extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        orderResultsUrl: SERVER_URL.concat(`/orders`),

        orderResultsTable: {
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
            ],
            rows: []
        },
        processing: false
    }

    async componentDidMount() {
        return this.setOrderResults();
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
                                    <CardTitle tag="h4">OrderResults</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="container">
                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.orderResultsTable}
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

    async setOrderResults() {

        const response = await axios.get(this.state.orderResultsUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
            </React.Fragment>
            return data;
        });

        this.setState({
            orderResultsTable: {
                columns: this.state.orderResultsTable.columns,
                rows: dataWithButton
            }
        });
    }
}


export default OrderResultAdmin;