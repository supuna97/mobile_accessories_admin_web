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

class SalesAgent extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        salesAgentsUrl: SERVER_URL.concat(`/sales_agent`),
        branchesUrl: SERVER_URL.concat(`/branch`),
        addModalOpen: false,
        updateModalOpen: false,
        addSalesAgent: {
            username: '',
            password: '',
            branchId: ''
        },
        updateSalesAgent: {
            id: '',
            username: '',
            password: '',
            branchId: ''
        },
        addSalesAgentErrors: {
            username: '',
            password: '',
            branchId: ''
        },
        updateSalesAgentErrors: {
            username: '',
            password: '',
            branchId: ''
        },
        salesAgentsTable: {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Name',
                    field: 'username',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Branch',
                    field: 'branchId',
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
        branches: [<option key='' value=''>(Select a branch)</option>],
        selectedBranchId: '',
        processing: false
    }

    addValidateSchema = {
        username: Joi.string().required(),
        password: Joi.string().required(),
        branchId: Joi.string().required()
    }

    updateValidateSchema = {
        id: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        branchId: Joi.string().required()
    }

    openAddModal = () => this.setState({addModalOpen: true});
    closeAddModal = () => this.setState({addModalOpen: false});

    openUpdateModal = () => this.setState({updateModalOpen: true});
    closeUpdateModal = () => this.setState({updateModalOpen: false});

    async componentDidMount() {
        await  this.setSalesAgentes();
        this.setBranches();
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
                                    <CardTitle tag="h4">Sales Agents</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="row container" style={{height: "12vh"}}>
                                        <div className="col-9">{}</div>
                                        <div className="col-3">
                                            <div className="d-flex align-items-end justify-content-end">
                                                <Button variant="primary" className="w-100" onClick={this.openAddModal}>Add New</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Modal show={this.state.addModalOpen} onHide={this.closeAddModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>New SalesAgent Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.addSalesAgent}>
                                                    <Row className="justify-content-center">
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="SalesAgent Name"
                                                                id="username"
                                                                name="username"
                                                                error={this.state.addSalesAgentErrors.username}
                                                                value={this.state.addSalesAgent.username}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="SalesAgent Password"
                                                                id="password"
                                                                name="password"
                                                                type={"password"}
                                                                error={this.state.addSalesAgentErrors.password}
                                                                value={this.state.addSalesAgent.password}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12" style={{display: Functions.getBranchComboVisibility()}}>
                                                            <InputSelect
                                                                label="Branch"
                                                                id="branchId"
                                                                name="branchId"
                                                                error={this.state.addSalesAgentErrors.branchId}
                                                                value={this.state.addSalesAgentErrors.branchId}
                                                                onChange={this.handleAddFormChange}
                                                                options={
                                                                    this.state.branches
                                                                }>
                                                            </InputSelect>
                                                        </Col>
                                                        <Col md="12">
                                                            <Button type="submit" variant="primary" block
                                                                    disabled={this.state.processing}>Save</Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={this.closeAddModal}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <Modal show={this.state.updateModalOpen} onHide={this.closeUpdateModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Update SalesAgent Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.updateSalesAgent}>
                                                    <Row>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="SalesAgent Name"
                                                                id="username"
                                                                name="username"
                                                                error={this.state.updateSalesAgentErrors.username}
                                                                value={this.state.updateSalesAgent.username}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="SalesAgent Password"
                                                                id="password"
                                                                name="password"
                                                                type={"password"}
                                                                error={this.state.updateSalesAgent.password}
                                                                value={this.state.updateSalesAgent.password}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12" style={{display: Functions.getBranchComboVisibility()}}>
                                                            <InputSelect
                                                                label="Branch"
                                                                id="branchId"
                                                                name="branchId"
                                                                error={this.state.updateSalesAgent.branchId}
                                                                value={this.state.updateSalesAgent.branchId}
                                                                onChange={this.handleUpdateFormChange}
                                                                options={
                                                                    this.state.branches
                                                                }>
                                                            </InputSelect>
                                                        </Col>
                                                        <Col md="12">
                                                            <Button type="submit" variant="primary" block
                                                                    disabled={this.state.processing}>Update</Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={this.closeUpdateModal}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <div className="container">
                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.salesAgentsTable}
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

    async setSalesAgentes() {

        const response = await axios.get(this.state.salesAgentsUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
                <button className="btn btn-danger btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.salesAgentDeleteClick}>Delete
                </button>
                <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.salesAgentUpdateClick}>Update
                </button>
            </React.Fragment>
            return data;
        });

        this.setState({
            salesAgentsTable: {
                columns: this.state.salesAgentsTable.columns,
                rows: dataWithButton
            }
        });
    }

    async setBranches() {
        if (!Functions.branchVisible()) return;
        const response = await axios.get(this.state.branchesUrl);
        let branchOptions = response.data.data.map(branch => {
            return <option key={branch.id} value={branch.id}>{branch.name}</option>
        });
        branchOptions = [<option key='' value=''>(Select a branch)</option>, ...branchOptions];

        this.setState({
            branches: branchOptions
        });
    }


    handleAddFormChange = ({currentTarget: input}) => {
        const addSalesAgent = {...this.state.addSalesAgent};
        addSalesAgent[input.name] = input.value;
        this.setState({addSalesAgent});
    }

    handleUpdateFormChange = ({currentTarget: input}) => {
        const updateSalesAgent = {...this.state.updateSalesAgent};
        updateSalesAgent[input.name] = input.value;
        this.setState({updateSalesAgent});
    }

    addSalesAgent = async event => {
        event.preventDefault();
        const addSalesAgentErrors = this.addFormErrors();
        this.setState({addSalesAgentErrors});
        if (Object.keys(addSalesAgentErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.post(this.state.salesAgentsUrl, this.state.addSalesAgent);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeAddModal();
                this.setState({addSalesAgent: {name: ''}});
                await this.setSalesAgentes();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    updateSalesAgent = async event => {
        event.preventDefault();
        const updateSalesAgentErrors = this.updateFormErrors();
        this.setState({updateSalesAgentErrors});
        if (Object.keys(updateSalesAgentErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.put(this.state.salesAgentsUrl, this.state.updateSalesAgent);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeUpdateModal();
                await this.setSalesAgentes();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    addFormErrors = () => {
        const errors = {};
        const {addSalesAgent} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(addSalesAgent, this.addValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    updateFormErrors = () => {
        const errors = {};
        const {updateSalesAgent} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(updateSalesAgent, this.updateValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    salesAgentDeleteClick = async (event) => {

        const selected = JSON.parse(event.target.value);
        event.preventDefault();

        const confirm = await Functions.confirmSwal('Yes, delete it!');

        if (!confirm.isConfirmed)
            return;

        this.setProcessing(true)

        try {
            const response = await axios
                .delete(this.state.salesAgentsUrl.concat('/').concat(selected.id));
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setSalesAgentes();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }

    salesAgentUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
        this.setState({
            updateSalesAgent: {
                id: selected.id,
                username: selected.username,
                password: selected.password,
                branchId: selected.branchId
            }
        });
        this.openUpdateModal();
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default SalesAgent;