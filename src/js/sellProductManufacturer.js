App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function() {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                alert('User denied account access');
                return;
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
            web3 = new Web3(window.web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
        $.getJSON('product.json', function(data) {
            var productArtifact = data;
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
            App.bindEvents();
        });
    },

    bindEvents: function() {
        $(document).on('click', '.btn-register', App.registerProduct);
        // QR code scanner callback integration
        if (window.onQRCodeScanned) {
            window.onQRCodeScanned = function(data) {
                let productSN = '';
                let sellerCode = '';
                if (typeof data === 'string' && data.includes(',')) {
                    [productSN, sellerCode] = data.split(',');
                } else if (typeof data === 'object') {
                    productSN = data.productSN || '';
                    sellerCode = data.sellerCode || '';
                } else {
                    productSN = data;
                }
                document.getElementById('productSN').value = productSN;
                document.getElementById('sellerCode').value = sellerCode;
                App.registerProduct();
            }
        }
    },

    registerProduct: function(event) {
        if (event) event.preventDefault();

        var productInstance;
        var productSN = document.getElementById('productSN').value;
        var sellerCode = document.getElementById('sellerCode').value;

        if (!productSN || !sellerCode) {
            alert('Product SN and Seller Code required!');
            return;
        }

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
                alert('Error fetching accounts');
                return;
            }
            if (!accounts || !accounts.length) {
                alert('No accounts found. Please unlock MetaMask.');
                return;
            }
            var account = accounts[0];
            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.manufacturerSellProduct(web3.fromAscii(productSN), web3.fromAscii(sellerCode), { from: account });
            }).then(function(result) {
                window.location.reload();
                document.getElementById('sellerName').innerHTML = '';
                document.getElementById('sellerBrand').innerHTML = '';
            }).catch(function(err) {
                console.log(err.message);
                alert('Blockchain transaction failed: ' + err.message);
            });
        });
    }
};

$(function() {
    $(window).on('load', function() {
        App.init();
    });
});