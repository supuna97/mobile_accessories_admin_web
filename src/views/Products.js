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

class Products extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        productsUrl: SERVER_URL.concat(`/product`),
        addModalOpen: false,
        updateModalOpen: false,
        addProduct: {
            name: ''
        },
        updateProduct: {
            id: '',
            name: '',
            statusId: 1
        },
        addProductErrors: {
            name: ''
        },
        updateProductErrors: {
            name: '',
            statusId: ''
        },
        productsTable: {
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
                    width: 250
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                    width: 150
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
        name: Joi.string().required()
    }

    updateValidateSchema = {
        id: Joi.string().required(),
        name: Joi.string().required(),
        statusId: Joi.number().required()
    }

    openAddModal = () => this.setState({addModalOpen: true});
    closeAddModal = () => this.setState({addModalOpen: false});

    openUpdateModal = () => this.setState({updateModalOpen: true});
    closeUpdateModal = () => this.setState({updateModalOpen: false});

    async componentDidMount() {
        return this.setProducts();
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
                                    <CardTitle tag="h4">Products</CardTitle>
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
                                            <Modal.Title>New Product Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.addProduct}>
                                                    <Row className="justify-content-center">
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Product Name"
                                                                id="name"
                                                                name="name"
                                                                error={this.state.addProductErrors.name}
                                                                value={this.state.addProduct.name}
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
                                            <Modal.Title>Update Product Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.updateProduct}>
                                                    <Row>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Product Name"
                                                                id="name"
                                                                name="name"
                                                                error={this.state.updateProductErrors.name}
                                                                value={this.state.updateProduct.name}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputSelect
                                                                label="Product Status"
                                                                id="statusId"
                                                                name="statusId"
                                                                error={this.state.updateProductErrors.statusId}
                                                                value={this.state.updateProduct.statusId}
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
                                                        data={this.state.productsTable}
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

    async setProducts() {

        const response = await axios.get(this.state.productsUrl);

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
            productsTable: {
                columns: this.state.productsTable.columns,
                rows: dataWithButton
            }
        });
    }

    handleAddFormChange = ({currentTarget: input}) => {
        const addProduct = {...this.state.addProduct};
        addProduct[input.name] = input.value;
        this.setState({addProduct});
    }

    handleUpdateFormChange = ({currentTarget: input}) => {
        const updateProduct = {...this.state.updateProduct};
        updateProduct[input.name] = input.value;
        this.setState({updateProduct});
    }

    addProduct = async event => {
        event.preventDefault();
        const addProductErrors = this.addFormErrors();
        this.setState({addProductErrors});
        if (Object.keys(addProductErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.post(this.state.productsUrl, this.state.addProduct);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeAddModal();
                this.setState({addProduct: {name: ''}});
                await this.setProducts();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    updateProduct = async event => {
        event.preventDefault();
        const updateProductErrors = this.updateFormErrors();
        this.setState({updateProductErrors});
        if (Object.keys(updateProductErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.put(this.state.productsUrl, this.state.updateProduct);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeUpdateModal();
                await this.setProducts();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    addFormErrors = () => {
        const errors = {};
        const {addProduct} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(addProduct, this.addValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    updateFormErrors = () => {
        const errors = {};
        const {updateProduct} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(updateProduct, this.updateValidateSchema, options);

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
                .delete(this.state.productsUrl.concat('/').concat(selected.id));
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setProducts();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }

    productUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
        this.setState({
            updateProduct: {
                id: selected.id,
                name: selected.name,
                statusId: selected.statusId
            }
        });
        this.openUpdateModal();
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default Products;