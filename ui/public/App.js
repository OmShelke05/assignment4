/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "no-alert": "off" */
function ProductRow(props) {
  const {
    product
  } = props;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.name), /*#__PURE__*/React.createElement("td", null, "$", product.pricePerUnit), /*#__PURE__*/React.createElement("td", null, product.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.imageUrl,
    target: "_blank"
  }, "View")));
}

function ProductTable(props) {
  const productRows = props.products.map(product => /*#__PURE__*/React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Product Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productRows));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      name: form.name.value,
      pricePerUnit: form.pricePerUnit.value.substr(1),
      category: form.category.value,
      imageUrl: form.imageUrl.value
    };
    this.props.createProduct(product);
    form.name.value = '';
    form.pricePerUnit.value = '$';
    form.category.value = '';
    form.imageUrl.value = '';
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("div", null, "Category\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0Price Per Unit", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      id: "categoryMenu",
      name: "category"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Shirts",
      selected: true
    }, "Shirts"), /*#__PURE__*/React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), /*#__PURE__*/React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), /*#__PURE__*/React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), /*#__PURE__*/React.createElement("option", {
      value: "Accessories"
    }, "Accessories")), "\xA0\xA0\xA0\xA0\xA0\xA0\xA0", /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "pricePerUnit",
      defaultValue: "$",
      size: "10"
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, "Product Name\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0Image URL", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "name",
      size: "10"
    }), "\xA0\xA0\xA0\xA0\xA0\xA0", /*#__PURE__*/React.createElement("input", {
      type: "URL",
      name: "imageUrl",
      size: "10"
    })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", null, "Add Product"));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
            productList {
              id
              name
              pricePerUnit
              category
              imageUrl
            }
          }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const body = await response.text();
    const result = JSON.parse(body);
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!) {
            addProduct(product: $product) {
                id
            }
          }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });
    this.loadData();
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "My Company Inventory"), /*#__PURE__*/React.createElement("p", null, "Showing all available products"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductTable, {
      products: this.state.products
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Add a new product to inventory"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = /*#__PURE__*/React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));