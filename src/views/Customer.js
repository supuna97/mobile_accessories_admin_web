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

class Customer extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        customersUrl: SERVER_URL.concat(`/customer`),
        updateModalOpen: false,
        updateCustomer: {
            id: '',
            name: '',
            address: '',
            tel: ''
        },
        updateCustomerErrors: {
            name: '',
            address: '',
            mobile: '',
            username: '',
            password: '',
        },
        customersTable: {
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
                    label: 'Mobile Number',
                    field: 'mobile',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Username',
                    field: 'username',
                    sort: 'asc',
                    width: 100
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

    updateValidateSchema = {
        id: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        mobile: Joi.number().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }

    openUpdateModal = () => this.setState({updateModalOpen: true});
    closeUpdateModal = () => this.setState({updateModalOpen: false});

    async componentDidMount() {
        return this.setCustomeres();
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
                                    <CardTitle tag="h4">Customers Details</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Modal show={this.state.updateModalOpen} onHide={this.closeUpdateModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Update Customer Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.updateCustomer}>
                                                    <Row>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Customer Name"
                                                                id="name"
                                                                name="name"
                                                                error={this.state.updateCustomerErrors.name}
                                                                value={this.state.updateCustomer.name}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Customer Address"
                                                                id="address"
                                                                name="address"
                                                                error={this.state.updateCustomerErrors.address}
                                                                value={this.state.updateCustomer.address}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Customer Mobile"
                                                                id="mobile"
                                                                name="mobile"
                                                                error={this.state.updateCustomerErrors.mobile}
                                                                value={this.state.updateCustomer.mobile}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Username"
                                                                id="username"
                                                                name="username"
                                                                error={this.state.updateCustomerErrors.username}
                                                                value={this.state.updateCustomer.username}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="New Password"
                                                                id="password"
                                                                name="password"
                                                                type="password"
                                                                error={this.state.updateCustomerErrors.password}
                                                                value={this.state.updateCustomer.password}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
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
                                                        data={this.state.customersTable}
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

    async setCustomeres() {

        const response = await axios.get(this.state.customersUrl);

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
            customersTable: {
                columns: this.state.customersTable.columns,
                rows: dataWithButton
            }
        });
    }

    handleUpdateFormChange = ({currentTarget: input}) => {
        const updateCustomer = {...this.state.updateCustomer};
        updateCustomer[input.name] = input.value;
        this.setState({updateCustomer});
    }

    updateCustomer = async event => {
        event.preventDefault();
        const updateCustomerErrors = this.updateFormErrors();
        this.setState({updateCustomerErrors});
        if (Object.keys(updateCustomerErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.put(this.state.customersUrl, this.state.updateCustomer);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeUpdateModal();
                await this.setCustomeres();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    updateFormErrors = () => {
        const errors = {};
        const {updateCustomer} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(updateCustomer, this.updateValidateSchema, options);

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
                .delete(this.state.customersUrl.concat('/').concat(selected.id));
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setCustomeres();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }

    productUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
        this.setState({
            updateCustomer: {
                id: selected.id,
                name: selected.name,
                address: selected.address,
                mobile: selected.mobile,
                username: selected.username,
                password: selected.password,
            }
        });
        this.openUpdateModal();
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}

export default Customer;