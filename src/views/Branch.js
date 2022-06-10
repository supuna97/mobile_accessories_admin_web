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

class Branch extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        branchesUrl: SERVER_URL.concat(`/branch`),
        addModalOpen: false,
        updateModalOpen: false,
        addBranch: {
            name: '',
            address: '',
            tel: ''
        },
        updateBranch: {
            id: '',
            name: '',
            address: '',
            tel: ''
        },
        addBranchErrors: {
            name: '',
            address: '',
            tel: ''
        },
        updateBranchErrors: {
            name: '',
            address: '',
            tel: '',
            statusId: ''
        },
        branchesTable: {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Address',
                    field: 'address',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Tel',
                    field: 'tel',
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
                    label: 'Created At',
                    field: 'createdAt',
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

    addValidateSchema = {
        name: Joi.string().required(),
        address: Joi.string().required(),
        tel: Joi.string().required()
    }

    updateValidateSchema = {
        id: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        tel: Joi.string().required(),
        statusId: Joi.number().required()
    }

    openAddModal = () => this.setState({addModalOpen: true});
    closeAddModal = () => this.setState({addModalOpen: false});

    openUpdateModal = () => this.setState({updateModalOpen: true});
    closeUpdateModal = () => this.setState({updateModalOpen: false});

    async componentDidMount() {
        return this.setBranches();
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
                                    <CardTitle tag="h4">Branches</CardTitle>
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
                                            <Modal.Title>New Branch Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.addBranch}>
                                                    <Row className="justify-content-center">
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Name"
                                                                id="name"
                                                                name="name"
                                                                error={this.state.addBranchErrors.name}
                                                                value={this.state.addBranch.name}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Address"
                                                                id="address"
                                                                name="address"
                                                                error={this.state.addBranchErrors.address}
                                                                value={this.state.addBranch.address}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Tel"
                                                                id="tel"
                                                                name="tel"
                                                                error={this.state.addBranchErrors.tel}
                                                                value={this.state.addBranch.tel}
                                                                onChange={this.handleAddFormChange}
                                                            />
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
                                            <Modal.Title>Update Branch Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.updateBranch}>
                                                    <Row>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Name"
                                                                id="name"
                                                                name="name"
                                                                error={this.state.updateBranchErrors.name}
                                                                value={this.state.updateBranch.name}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Address"
                                                                id="address"
                                                                name="address"
                                                                error={this.state.updateBranchErrors.address}
                                                                value={this.state.updateBranch.address}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Branch Tel"
                                                                id="tel"
                                                                name="tel"
                                                                error={this.state.updateBranchErrors.tel}
                                                                value={this.state.updateBranch.tel}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputSelect
                                                                label="Branch Status"
                                                                id="statusId"
                                                                name="statusId"
                                                                error={this.state.updateBranchErrors.statusId}
                                                                value={this.state.updateBranch.statusId}
                                                                onChange={this.handleUpdateFormChange}
                                                                options={[
                                                                    <option key={1} value={1}>Active</option>,
                                                                    <option key={0} value={0}>Inactive</option>
                                                                ]}>
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
                                                        data={this.state.branchesTable}
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

        const response = await axios.get(this.state.branchesUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
                <button className="btn btn-danger btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.productDeleteClick}>Delete
                </button>
                <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.productUpdateClick}>Update
                </button>
            </React.Fragment>
            return data;
        });

        this.setState({
            branchesTable: {
                columns: this.state.branchesTable.columns,
                rows: dataWithButton
            }
        });
    }

    handleAddFormChange = ({currentTarget: input}) => {
        const addBranch = {...this.state.addBranch};
        addBranch[input.name] = input.value;
        this.setState({addBranch});
    }

    handleUpdateFormChange = ({currentTarget: input}) => {
        const updateBranch = {...this.state.updateBranch};
        updateBranch[input.name] = input.value;
        this.setState({updateBranch});
    }

    addBranch = async event => {
        event.preventDefault();
        const addBranchErrors = this.addFormErrors();
        this.setState({addBranchErrors});
        if (Object.keys(addBranchErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.post(this.state.branchesUrl, this.state.addBranch);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeAddModal();
                this.setState({addBranch: {name: ''}});
                await this.setBranches();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    updateBranch = async event => {
        event.preventDefault();
        const updateBranchErrors = this.updateFormErrors();
        this.setState({updateBranchErrors});
        if (Object.keys(updateBranchErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.put(this.state.branchesUrl, this.state.updateBranch);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeUpdateModal();
                await this.setBranches();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    addFormErrors = () => {
        const errors = {};
        const {addBranch} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(addBranch, this.addValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    updateFormErrors = () => {
        const errors = {};
        const {updateBranch} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(updateBranch, this.updateValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    productDeleteClick = async (event) => {

        const selected = JSON.parse(event.target.value);
        event.preventDefault();

        const confirm = await Functions.confirmSwal('Yes, delete it!');

        if (!confirm.isConfirmed)
            return;

        this.setProcessing(true)

        try {
            const response = await axios
                .delete(this.state.branchesUrl.concat('/').concat(selected.id));
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setBranches();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }

    productUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
        this.setState({
            updateBranch: {
                id: selected.id,
                name: selected.name,
                address: selected.address,
                tel: selected.tel,
                statusId: selected.statusId
            }
        });
        this.openUpdateModal();
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default Branch;