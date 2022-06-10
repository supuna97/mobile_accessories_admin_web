import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL, USER_KEY, USER_ROLES} from "../variables/constants";
import Functions from "../variables/functions";
import {Button, Modal} from "react-bootstrap";
import {InputText, InputSelect, InputNumber} from "../variables/input";
import Joi from "joi-browser";
import INTERCEPTOR from "variables/global/interceptor";
import Memory from "../variables/memory";

class Stock extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        stocksUrl: SERVER_URL.concat(`/stock`),
        branchesUrl: SERVER_URL.concat(`/branch`),
        productsUrl: SERVER_URL.concat(`/product`),
        addModalOpen: false,
        updateModalOpen: false,
        addStock: {
            description: '',
            qty: '',
            price: '',
            branchId: '',
            productId: ''
        },
        updateStock: {
            id: '',
            description: '',
            qty: '',
            price: '',
            branchId: '',
            productId: ''
        },
        addStockErrors: {
            description: '',
            address: '',
            qty: '',
            branchId: '',
            productId: ''
        },
        updateStockErrors: {
            description: '',
            address: '',
            qty: '',
            branchId: '',
            productId: ''
        },
        stocksTable: {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Description',
                    field: 'description',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'QTY',
                    field: 'qty',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Product',
                    field: 'productName',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Created At',
                    field: 'createdAt',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Action',
                    field: 'action',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows: []
        },
        branches: [<option key='' value=''>(Select a branch)</option>],
        products: [<option key='' value=''>(Select a product)</option>],
        selectedBranchId: '',
        processing: false
    }

    addValidateSchema = {
        description: Joi.string().required(),
        qty: Joi.number().required(),
        price: Joi.number().required(),
        branchId: Joi.string().required(),
        productId: Joi.string().required()
    }

    updateValidateSchema = {
        id: Joi.string().required(),
        description: Joi.string().required(),
        qty: Joi.number().required(),
        price: Joi.number().required(),
        branchId: Joi.string().required(),
        productId: Joi.string().required()
    }

    openAddModal = () => this.setState({addModalOpen: true});
    closeAddModal = () => this.setState({addModalOpen: false});

    openUpdateModal = () => this.setState({updateModalOpen: true});
    closeUpdateModal = () => this.setState({updateModalOpen: false});

    async componentDidMount() {
        await this.setBranchId();
        this.setStocks();
        this.setBranches();
        this.setProducts();
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
                                    <CardTitle tag="h4">Stocks</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <div className="row container" style={{height: "12vh"}}>
                                        <div className="align-items-start justify-content-start col-4"
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

                                        <div className="align-items-center justify-content-center col-3">
                                            <Button variant="primary" className="w-100" onClick={this.openAddModal}>Add
                                                New</Button>
                                        </div>
                                    </div>

                                    <Modal show={this.state.addModalOpen} onHide={this.closeAddModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>New Stock Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.addStock}>
                                                    <Row className="justify-content-center">
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Stock Description"
                                                                id="description"
                                                                name="description"
                                                                error={this.state.addStockErrors.description}
                                                                value={this.state.addStock.description}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputNumber
                                                                label="QTY"
                                                                id="qty"
                                                                name="qty"
                                                                error={this.state.addStockErrors.qty}
                                                                value={this.state.addStock.qty}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputNumber
                                                                label="Price Per One"
                                                                id="price"
                                                                name="price"
                                                                error={this.state.addStockErrors.price}
                                                                value={this.state.addStock.price}
                                                                onChange={this.handleAddFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12" style={{display: Functions.getBranchComboVisibility()}}>
                                                            <InputSelect
                                                                label="Branch"
                                                                id="branchId"
                                                                name="branchId"
                                                                error={this.state.addStockErrors.branchId}
                                                                value={this.state.addStock.branchId}
                                                                onChange={this.handleAddFormChange}
                                                                options={
                                                                    this.state.branches
                                                                }>
                                                            </InputSelect>
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputSelect
                                                                label="Product"
                                                                id="productId"
                                                                name="productId"
                                                                error={this.state.addStockErrors.productId}
                                                                value={this.state.addStock.productId}
                                                                onChange={this.handleAddFormChange}
                                                                options={
                                                                    this.state.products
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
                                            <Modal.Title>Update Stock Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <Form onSubmit={this.updateStock}>
                                                    <Row>
                                                        <Col className="pr-1" md="12">
                                                            <InputText
                                                                label="Stock Description"
                                                                id="description"
                                                                name="description"
                                                                error={this.state.updateStockErrors.description}
                                                                value={this.state.updateStock.description}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputNumber
                                                                label="QTY"
                                                                id="qty"
                                                                name="qty"
                                                                error={this.state.updateStockErrors.qty}
                                                                value={this.state.updateStock.qty}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputNumber
                                                                label="Price Per One"
                                                                id="price"
                                                                name="price"
                                                                error={this.state.updateStockErrors.price}
                                                                value={this.state.updateStock.price}
                                                                onChange={this.handleUpdateFormChange}
                                                            />
                                                        </Col>
                                                        <Col className="pr-1" md="12" style={{display: Functions.getBranchComboVisibility()}}>
                                                            <InputSelect
                                                                label="Branch"
                                                                id="branchId"
                                                                name="branchId"
                                                                error={this.state.updateStockErrors.branchId}
                                                                value={this.state.updateStock.branchId}
                                                                onChange={this.handleUpdateFormChange}
                                                                options={
                                                                    this.state.branches
                                                                }>
                                                            </InputSelect>
                                                        </Col>
                                                        <Col className="pr-1" md="12">
                                                            <InputSelect
                                                                label="Product"
                                                                id="productId"
                                                                name="productId"
                                                                error={this.state.updateStockErrors.productId}
                                                                value={this.state.updateStock.productId}
                                                                onChange={this.handleUpdateFormChange}
                                                                options={
                                                                    this.state.products
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
                                                        data={this.state.stocksTable}
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

    async setStocks() {

        const selectedBranchId = this.state.selectedBranchId;
        const response = await axios.get(selectedBranchId ? this.state.stocksUrl + `/branch/` + selectedBranchId
            : this.state.stocksUrl);

        const dataWithButton = response.data.data.map(data => {
            data.action = <React.Fragment>
                <button className="btn btn-warning btn-sm w-20 ml-1" value={JSON.stringify(data)}
                        onClick={this.productUpdateClick}>Update
                </button>
            </React.Fragment>
            return data;
        });

        this.setState({
            stocksTable: {
                columns: this.state.stocksTable.columns,
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

    async setProducts() {
        const response = await axios.get(this.state.productsUrl);
        let productOptions = response.data.data.map(product => {
            return <option key={product.id} value={product.id}>{product.name}</option>
        });
        productOptions = [<option key='' value=''>(Select a product)</option>, ...productOptions];

        this.setState({
            products: productOptions
        });
    }

    handleAddFormChange = ({currentTarget: input}) => {
        const addStock = {...this.state.addStock};
        addStock[input.name] = input.value;
        this.setState({addStock});
    }

    handleUpdateFormChange = ({currentTarget: input}) => {
        const updateStock = {...this.state.updateStock};
        updateStock[input.name] = input.value;
        this.setState({updateStock});
    }

    handleSelectBranchChange = async ({currentTarget: input}) => {
        let selectedBranchId = input.value;
        await this.setState({selectedBranchId});
        this.setStocks();
    }

    addStock = async event => {
        event.preventDefault();
        const addStockErrors = this.addFormErrors();
        this.setState({addStockErrors});
        if (Object.keys(addStockErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.post(this.state.stocksUrl, this.state.addStock);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeAddModal();
                this.setState({
                    description: '',
                    qty: '',
                    price: '',
                    branchId: '',
                    productId: ''
                });
                await this.setStocks();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    updateStock = async event => {
        event.preventDefault();
        const updateStockErrors = this.updateFormErrors();
        this.setState({updateStockErrors});
        if (Object.keys(updateStockErrors).length > 0)
            return;

        this.setProcessing(true);

        try {
            const response = await axios.put(this.state.stocksUrl, this.state.updateStock);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeUpdateModal();
                await this.setStocks();
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    addFormErrors = () => {
        const errors = {};
        const {addStock} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(addStock, this.addValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    updateFormErrors = () => {
        const errors = {};
        const {updateStock} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(updateStock, this.updateValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    stockDeleteClick = async (event) => {

        const selected = JSON.parse(event.target.value);
        event.preventDefault();

        const confirm = await Functions.confirmSwal('Yes, delete it!');

        if (!confirm.isConfirmed)
            return;

        this.setProcessing(true)

        try {
            const response = await axios
                .delete(this.state.stocksUrl.concat('/').concat(selected.id));
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                await this.setStocks();
            }
        } catch (e) {
        }
        this.setProcessing(false);
    }

    productUpdateClick = (event) => {
        const selected = JSON.parse(event.target.value);
        this.setState({
            updateStock: {
                id: selected.id,
                description: selected.description,
                qty: selected.qty,
                price: selected.price,
                branchId: selected.branchId,
                productId: selected.productId
            }
        });
        this.openUpdateModal();
    }

    async setBranchId() {
        const userData = Memory.getValue(USER_KEY);
        const selectedBranchId = userData.userRole === USER_ROLES.HEAD_OFFICE_ADMIN
            ? this.state.selectedBranchId : userData.branchId;
        await this.setState({selectedBranchId: selectedBranchId});
        const updateStock = {...this.state.updateStock};
        updateStock.branchId = selectedBranchId;
        this.setState({updateStock});
        const addStock = {...this.state.addStock};
        addStock.branchId = selectedBranchId;
        this.setState({addStock});
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default Stock;