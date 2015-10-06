// robby
// 4/5/15

var React = require('react/addons')
    , ImageGallery = require('react-image-gallery')
    , ReactScriptLoaderMixin = require('../lib/ReactScriptLoader').ReactScriptLoaderMixin;

var ImageView = React.createClass({displayName: "ImageView",
    render: function() {
        var imagesRaw = this.props.tip.images;
        var images = imagesRaw.map(function(imageRaw){
            return {
                original: imageRaw.url,
                thumbnail: imageRaw.url
            }
        });
        return (
            React.createElement("div", {className: "image-gallery-container"}, 
                React.createElement(ImageGallery, {items: images, showThumbnails: true, showBullets: false})
            )
        );
    }
});

var FramingView = React.createClass({displayName: "FramingView",
    render: function() {
        if( this.props.tip.framing ) {
            return (
                React.createElement("h5", {id: "framing", className: "framing"}, this.props.tip.framing)
            );
        } else {
            return null;
        }
    }
});

var HeadingView = React.createClass({displayName: "HeadingView",
    render: function() {
        return (
            React.createElement("h2", {className: "heading"}, this.props.tip.heading)
        );
    }
})

var DescriptionView = React.createClass({displayName: "DescriptionView",
    render: function() {
        var description = this.props.tip.description;
        try {
            description = decodeURIComponent( description );
        } catch( error ) {
            console.log( "Problem decoding description." );
        }
        return (
            React.createElement("p", {className: "description-container"}, description)
        );
    }
});

var ReviewsView = React.createClass({displayName: "ReviewsView",
    render: function() {
        if( this.props.numReviews && parseInt(this.props.numReviews) > 0 ) {
            return React.createElement("span", {className: "reco-reviews"}, this.props.numReviews, " Reviews")
        }
        return React.createElement("div", null);
    }
});

var PriceView = React.createClass({displayName: "PriceView",
    render: function() {
        return React.createElement("span", {id: "price-view", className: "price-view"}, this.props.tip.price)
    }
});

var ShippingView = React.createClass({displayName: "ShippingView",
    render: function() {
        return React.createElement("span", {id: "shipping-view", className: "shipping-view"}, "Free Shipping!")
    }
})

var StarRatingView = React.createClass({displayName: "StarRatingView",
    render: function() {
        if( parseFloat(this.props.tip.rating) >= 0 ) {
            var ratingStr = this.props.tip.rating + "";
            if( ratingStr[ratingStr.length-1] == "0" ) {
                ratingStr = ratingStr[0];
            }
            var src = "/img/tip/tiles-stars-"+ ratingStr+".png" ;
            return (
                React.createElement("div", {className: "rating-container"}, 
                    React.createElement("img", {className: "product-reco-rating", id: "product-reco-rating", src: src}), 
                    React.createElement(ReviewsView, {numReviews: this.props.tip.numReviews})
                )
            );

        }
        return null;
    }
});

var StripeButton = React.createClass({displayName: "StripeButton",
    mixins: [ReactScriptLoaderMixin],
    getScriptURL: function() {
        return 'https://checkout.stripe.com/checkout.js';
    },

    statics: {
        stripeHandler: null,
        scriptDidError: false
    },

    // Indicates if the user has clicked on the button before the
    // the script has loaded.
    hasPendingClick: false,

    processToken: function(token) {
        var payload = {};
        payload.shippingAddress = {
            street: token.card.address_line1,
            city: token.card.address_city,
            state: token.card.address_state,
            zip: token.card.address_zip,
            country: token.card.country
        }
        payload.token = token.id;
        var self = this;
        $.ajax({
            url: PURCHASE_URL,
            type: "POST",
            data: payload,
            success: function(response) {
                console.log(response);
            }
        })

    },

    onScriptLoaded: function() {
        // Initialize the Stripe handler on the first onScriptLoaded call.
        // This handler is shared by all StripeButtons on the page.
        var self = this;
        var stripeKey = STRIPE_KEY || sk_test_TNOR2L6hPnkIsRWoY0dQRHpr;
        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                "key": stripeKey,
                "image": '/img/swell-symbol.svg',
                "name": this.props.tip.heading,
                "billingAddress": true,
                "shippingAddress": true,
                "token": function(token) {
                    console.log(token);
                    self.processToken(token);
                }
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    },
    showLoadingDialog: function() {
        // show a loading dialog
    },
    hideLoadingDialog: function() {
        // hide the loading dialog
    },
    showStripeDialog: function() {
        this.hideLoadingDialog();
        var rawPrice = this.props.tip.price;
        var priceParts = rawPrice.split('$');
        var priceFloat = parseFloat(priceParts[1]);
        var amount = priceFloat * 100;
        StripeButton.stripeHandler.open({
            name: this.props.tip.heading,
            description:  this.props.tip.price,
            amount: amount
        });
    },
    onScriptError: function() {
        this.hideLoadingDialog();
        StripeButton.scriptDidError = true;
    },
    onClick: function() {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        } else {
            this.showLoadingDialog();
            this.hasPendingClick = true;
        }
    },
    render: function() {
        return (
            React.createElement("button", {onClick: this.onClick, className: "buy-button"}, "Buy ", this.props.tip.price)
        );
    }
});

var TipView = React.createClass({displayName: "TipView",
    render: function () {
        return(
            React.createElement("div", {className: "tip-view-container"}, 
                React.createElement(FramingView, {tip: TIP}), 
                React.createElement(ImageView, {tip: TIP}), 
                React.createElement(HeadingView, {tip: TIP}), 
                React.createElement(StarRatingView, {tip: TIP}), 
                React.createElement(PriceView, {tip: TIP}), 
                React.createElement(ShippingView, {tip: TIP}), 
                React.createElement(StripeButton, {tip: TIP}), 
                React.createElement(DescriptionView, {tip: TIP}), 
                React.createElement("h3", {className: "guarantee-heading"}, "100% Satisfaction Guarentee"), 
                React.createElement("p", {className: "guarantee-body"}, "We stand behind everything we sell. If you are not satisfied with your purchase, we’ll make sure to take care of your returns for a replacement or refund.")
            )
        )
    }
});

React.render( React.createElement(TipView, null), document.getElementById("main-container") );