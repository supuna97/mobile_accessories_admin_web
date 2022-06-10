import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL, USER_KEY, USER_ROLES} from "../variables/constants";
import {Button, Modal} from "react-bootstrap";
import {InputSelect} from "../variables/input";
import INTERCEPTOR from "variables/global/interceptor";
import {internalRoutes} from "../routes";
import Memory from "../variables/memory";
import Functions from "../variables/functions";

class StockRequest extends React.Component {
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
        this.setBranches();
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
                                    <CardTitle tag="h4">Stock Requests</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="row container" style={{height: "12vh"}}>
                                        <div className="align-items-start justify-content-start col-6"
                                             style={{marginTop: "10px", display: Functions.getBranchComboVisibility()}}>
                                            <InputSelect
                                                label=""
                                                id="selectBranchId"
                                                name="selectBranchId"
                                                error={''}
                                                value={this.state.selectedBranchId}
                                                onChange={this.handleSelectBranchChange}
                                                options={
                                                    this.state.branches
                                                }
                                            >
                                            </InputSelect>
                                        </div>
                                        <div className="col-3">
                                            <div className="d-flex align-items-end justify-content-end">
                                                <Button variant="primary" className="w-100" onClick={this.redirectToAdd}>Add New</Button>
                                            </div>
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

    async setBranches() {
        if (!Functions.branchVisible()) return;
        const response = await axios.get(this.state.branchesUrl);
        let branchOptions = response.data.data.map(branch => {
            return <option key={branch.id} value={branch.id}>{branch.name}</option>
        });
        branchOptions = [<option key='' value=''>(Select a from branch)</option>, ...branchOptions];

        this.setState({
            branches: branchOptions
        });
    }

    async setStockRequests() {

        const selectedBranchId = this.state.selectedBranchId

        const response = await axios.get(selectedBranchId
            ? this.state.stockRequestsUrl + `/by-branch/` + selectedBranchId
            : this.state.stockRequestsUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
                <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.stockRequestUpdateClick}>Update
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

    stockRequestUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }

    redirectToAdd = () => {
        const path = internalRoutes[0].layout + internalRoutes[0].path;
        this.props.history.push(path);
    }

    async setBranchId() {
        const userData = Memory.getValue(USER_KEY);
        const selectedBranchId = userData.userRole === USER_ROLES.HEAD_OFFICE_ADMIN
            ? this.state.selectedBranchId : userData.branchId;
        await this.setState({selectedBranchId: selectedBranchId});
    }
}


export default StockRequest;