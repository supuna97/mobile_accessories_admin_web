import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL} from "../variables/constants";
import Functions from "../variables/functions";
import {Button, Modal} from "react-bootstrap";
import {InputText, InputSelect} from "../variables/input";
import Joi from "joi-browser";
import INTERCEPTOR from "variables/global/interceptor";

class TotalSales extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        totalOrdersUrl: SERVER_URL.concat(`/orders/total_sales_by_sales_agents`),
        addTotalSales: {
            name: ''
        },
        
        totalOrdersTable: {
            columns: [
                {
                    label: 'Sales Agent ID',
                    field: 'repId',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Sales Agent Name',
                    field: 'repName',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Branch ID',
                    field: 'branchId',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Branch Name',
                    field: 'branchName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Total Orders',
                    field: 'totalOrder',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Total Amount',
                    field: 'totalAmount',
                    sort: 'asc',
                    width: 200
                }
            ],
            rows: []
        },
        processing: false
    }

    async componentDidMount() {
        return this.setTotalSaless();
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
                                    <CardTitle tag="h4">Sales Agent wise Total Sales of Orders</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="container">
                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.totalOrdersTable}
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

    async setTotalSaless() {

        const response = await axios.get(this.state.totalOrdersUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
            </React.Fragment>
            return data;
        });

        this.setState({
            totalOrdersTable: {
                columns: this.state.totalOrdersTable.columns,
                rows: dataWithButton
            }
        });
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default TotalSales;