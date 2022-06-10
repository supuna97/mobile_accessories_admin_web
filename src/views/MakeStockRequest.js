import React from "react";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Row} from "reactstrap";
import {MDBBtn, MDBDataTableV5} from 'mdbreact';
import axios from "axios";
import {SERVER_URL, USER_KEY} from "../variables/constants";
import Functions from "../variables/functions";
import {Button, Modal} from "react-bootstrap";
import {InputText, InputSelect, InputNumber} from "../variables/input";
import Joi from "joi-browser";
import INTERCEPTOR from "variables/global/interceptor";
import Memory from "../variables/memory";

class MakeStockRequest extends React.Component {
    state = {
        interceptor: INTERCEPTOR, // added this line to avoid unused import warning for INTERCEPTOR
        branchesUrl: SERVER_URL.concat(`/branch`),
        stockRequestsUrl: SERVER_URL.concat(`/stock-request`),
        productsUrl: SERVER_URL.concat(`/product`),
        stockRequestErrors: {
            byBranchId: '',
            forBranchId: '',
            vehicleId: '',
            productId: '',
            qty: 0,
            products: ''
        },
        productAddData: {
            forBranchId: Memory.getValue(USER_KEY).branchId,
            byBranchId: '',
            qty: '',
            productId: ''
        },
        productAddDataErrors: {
            byBranchId: '',
            qty: '',
            productId: ''
        },
        productDetailsTableTmp: {
            productId: '',
            productName: '',
            qty: ''
        },
        addedProductDetailsTable: {
            columns: [
                {
                    label: 'Product',
                    field: 'productName',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'QTY',
                    field: 'qty',
                    sort: 'asc',
                    width: 200
                }
            ],
            rows: []
        },
        branches: [<option key='' value=''>(Select a from branch)</option>],
        products: [<option key='' value=''>(Select a from product)</option>],
        processing: false
    }

    addValidateSchema = {
        byBranchId: Joi.string().required(),
        forBranchId: Joi.string().required(),
    }

    addDataValidateSchema = {
        forBranchId: Joi.string().required(),
        byBranchId: Joi.string().required(),
        productId: Joi.string().required(),
        qty: Joi.number().required(),
    }

    async componentDidMount() {
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
                                    <CardTitle tag="h4">Make Stock Request</CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex align-items-end justify-content-end">
                                                <div className="container">
                                                    <Form onSubmit={this.addToSelectedClick}>
                                                        <Row >
                                                            <Col className="pr-1" md="4">
                                                                <InputSelect
                                                                    label="Branch"
                                                                    id="byBranchId"
                                                                    name="byBranchId"
                                                                    error={this.state.productAddDataErrors.byBranchId}
                                                                    value={this.state.productAddData.byBranchId}
                                                                    onChange={this.handleAddFormChange}
                                                                    options={
                                                                        this.state.branches
                                                                    }
                                                                >
                                                                </InputSelect>
                                                            </Col>
                                                            <Col className="pr-1" md="4">
                                                                <InputSelect
                                                                    label="Product"
                                                                    id="productId"
                                                                    name="productId"
                                                                    error={this.state.productAddDataErrors.productId}
                                                                    value={this.state.productAddData.productId}
                                                                    onChange={this.handleAddFormChange}
                                                                    options={
                                                                        this.state.products
                                                                    }
                                                                >
                                                                </InputSelect>
                                                            </Col>
                                                            <Col className="pr-1" md="4">
                                                                <InputNumber
                                                                    label="QTY"
                                                                    id="qty"
                                                                    name="qty"
                                                                    error={this.state.productAddDataErrors.qty}
                                                                    value={this.state.productAddData.qty}
                                                                    onChange={this.handleAddFormChange}
                                                                />
                                                            </Col>
                                                            <Col className="col-4">
                                                                <Button type="submit" variant="primary" block>
                                                                    Save</Button>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr/>
                                    <div className="container">
                                        {this.state.stockRequestErrors.products ?
                                            <div className="alert alert-danger">
                                                {this.state.stockRequestErrors.products}</div> : ''}

                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]}
                                                        entries={5}
                                                        data={this.state.addedProductDetailsTable}
                                                        fullPagination
                                                        searchTop searchBottom={false}/>
                                    </div>
                                    <Col className="col-3" md="4">
                                        <Button type="submit" variant="primary" block
                                                disabled={this.state.processing}
                                                onClick={this.addStockRequest}>Add Stock Request</Button>
                                    </Col>
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
        const productAddData = {...this.state.productAddData};
        productAddData[input.name] = input.value;

        let productId = '';
        let productName = '';
        let qty = '';
        if (input.name === 'productId') {
            productId = input.value;
            productName = input.selectedOptions[0].text;
            qty = this.state.productDetailsTableTmp.qty;
        } else if (input.name === 'qty') {
            productId = this.state.productDetailsTableTmp.productId;
            productName = this.state.productDetailsTableTmp.productName;
            qty = input.value;
        }

        this.setState({
            productDetailsTableTmp: {
                productId: productId,
                productName: productName,
                qty: qty
            }
        });

        this.setState({productAddData});
    }

    addStockRequest = async event => {
        event.preventDefault();
        const stockRequestErrors = this.makeRequestErrors();
        this.setState({stockRequestErrors});

        if (Object.keys(stockRequestErrors).length > 0)
            return;

        const makeRequestData = {
            forBranchId: this.state.productAddData.forBranchId,
            byBranchId: this.state.productAddData.byBranchId,
            stockRequestDetails: this.state.addedProductDetailsTable.rows.map(addedProduct => ({
                productId: addedProduct.productId,
                qty: addedProduct.qty
            }))
        };

        this.setProcessing(true);

        try {
            const response = await axios.post(this.state.stockRequestsUrl, makeRequestData);
            if (response.data.success) {
                Functions.successSwal(response.data.message);
                this.closeAddModal();
                this.setState({
                    stockRequest: {
                        id: '',
                        byBranchId: '',
                        forBranchId: '',
                        vehicleId: ''
                    }
                });
            }
        } catch (e) {
        }

        this.setProcessing(false);
    }

    addToSelectedClick = (event) => {
        event.preventDefault();
        const productAddDataErrors = this.addFormErrors();
        console.log(productAddDataErrors);
        this.setState({productAddDataErrors});
        if (Object.keys(productAddDataErrors).length > 0)
            return;
        let addedProductDetailsTable = this.state.addedProductDetailsTable;
        const newAddedProducts = [this.state.productDetailsTableTmp, ...addedProductDetailsTable.rows];
        this.setState({
            addedProductDetailsTable: {
                columns: addedProductDetailsTable.columns,
                rows: newAddedProducts
            }
        });
    }

    addFormErrors = () => {
        const errors = {};
        const {productAddData} = this.state;
        const options = {abortEarly: false};
        let validate = Joi.validate(productAddData, this.addDataValidateSchema, options);

        if (!validate.error) return errors;

        for (const detail of validate.error.details)
            errors[detail.path] = detail.message;
        return errors;
    }

    makeRequestErrors = () => {
        const errors = {};
        const stateErrors = this.state.stockRequestErrors;
        const addedData = this.state.addedProductDetailsTable.rows;
        if (addedData.length <= 0)
            errors.products = 'Please add at least one product';

        this.setState({
            stockRequestErrors: {
                byBranchId: stateErrors.byBranchId,
                forBranchId: stateErrors.forBranchId,
                vehicleId: stateErrors.vehicleId,
                productId: stateErrors.productId,
                qty: stateErrors.qty,
                products: errors.products
            }
        });
        return errors;
    }

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }
}


export default MakeStockRequest;