function TIDEModule(data) {

    var productData = data || {};

    Object.defineProperties(this, {
        "theme": {
            get: () => {
                if (productData.theme)
                    return productData.theme;
                else
                    return productData.theme = "dark";
            },
            set: (value) => {
                productData.theme = value;
            }
        },
        "lang": {
            get: () => {
                return productData.lang;
            },
            set: (value) => {
                productData.lang = value;
            }
        }
    });
}

module.exports = TIDEModule;