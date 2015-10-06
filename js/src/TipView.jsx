// robby
// 4/5/15

var React = require('react/addons')
    , ImageGallery = require('react-image-gallery')
    , ReactScriptLoaderMixin = require('../lib/ReactScriptLoader').ReactScriptLoaderMixin;

var ImageView = React.createClass({
    render: function() {
        var imagesRaw = this.props.tip.images;
        var images = imagesRaw.map(function(imageRaw){
            return {
                original: imageRaw.url,
                thumbnail: imageRaw.url
            }
        });
        if( images.length < 1 ) {
            return null;
        } else if( images.length == 1 ) {
            var imageUrl = images[0].original;
            return (
                <div class="image-gallery-slides">
                    <div className="image-gallery-slide center">
                        <img src={imageUrl} />
                    </div>
                </div>
            );
        }

        return (
            <div className="image-gallery-container">
                <ImageGallery items={images} showThumbnails={true} showBullets={false}/>
            </div>
        );


    }
});

var FramingView = React.createClass({
    render: function() {
        if( this.props.tip.framing ) {
            return (
                <h5 id="framing" className="framing">{this.props.tip.framing}</h5>
            );
        } else {
            return null;
        }
    }
});

var HeadingView = React.createClass({
    render: function() {
        return (
            <h2 className="heading">{this.props.tip.heading}</h2>
        );
    }
})

var DescriptionView = React.createClass({
    render: function() {
        var description = this.props.tip.description;
        try {
            description = decodeURIComponent( description );
        } catch( error ) {
            console.log( "Problem decoding description." );
        }
        return (
            <p className="description-container">{description}</p>
        );
    }
});

var ReviewsView = React.createClass({
    render: function() {
        if( this.props.numReviews && parseInt(this.props.numReviews) > 0 ) {
            return <span className="reco-reviews">{this.props.numReviews} Reviews</span>
        }
        return <div></div>;
    }
});

var PriceView = React.createClass({
    render: function() {
        return <span id="price-view" className="price-view">{this.props.tip.price}</span>
    }
});

var ShippingView = React.createClass({
    render: function() {
        return <span id="shipping-view" className="shipping-view">Free Shipping &amp; Returns!</span>
    }
})

var StarRatingView = React.createClass({
    render: function() {
        if( parseFloat(this.props.tip.rating) >= 0 ) {
            var ratingStr = this.props.tip.rating + "";
            if( ratingStr[ratingStr.length-1] == "0" ) {
                ratingStr = ratingStr[0];
            }
            var src = "/img/tip/tiles-stars-"+ ratingStr+".png" ;
            return (
                <div className="rating-container">
                    <img className="product-reco-rating" id="product-reco-rating" src={src}></img>
                    <ReviewsView numReviews={this.props.tip.numReviews} />
                </div>
            );

        }
        return null;
    }
});

var StripeButton = React.createClass({
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

    processToken: function(token, args) {
        var payload = {};
        payload.shippingAddress = {
            name: args.shipping_name,
            street: args.shipping_address_line1,
            city: args.shipping_address_city,
            state: args.shipping_address_state,
            zip: args.shipping_address_zip,
            country: args.shipping_address_country
        }
        payload.billingAddress = {
            name: args.billing_name,
            street: args.billing_address_line1,
            city: args.billing_address_city,
            state: args.billing_address_state,
            zip: args.billing_address_zip,
            country: args.billing_address_country
        }
        payload.token = token.id;
        payload.email = token.email;

        var self = this;
        $.ajax({
            url: PURCHASE_URL,
            type: "POST",
            data: payload,
            success: function(response) {
                console.log(response);
            }
        });

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
                "token": function(token, args) {
                    self.processToken(token, args);
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
        $.ajax({
            url: '/tip/' + TIP_HASH + '/track/Web_ProductDetail_Buy_Click',
            type: "POST",
            success: function(response) {
                console.log(response);
            }
        });
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
            <button onClick={this.onClick} className="buy-button">Buy {this.props.tip.price}</button>
        );
    }
});

var TipView = React.createClass({
    render: function () {
        return(
            <div className="tip-view-container">
                <FramingView tip={TIP} />
                <ImageView tip={TIP} />
                <HeadingView tip={TIP} />
                <StarRatingView tip={TIP} />
                <PriceView tip={TIP} />
                <ShippingView tip={TIP} />
                <StripeButton tip={TIP}/>
                <DescriptionView tip={TIP}/>
                <h3 className="guarantee-heading">100% Satisfaction Guarentee</h3>
                <p className="guarantee-body">We stand behind everything we sell. If you are not satisfied with your purchase, we’ll make sure to take care of your returns for a replacement or refund.</p>
            </div>
        )
    }
});

React.render( <TipView />, document.getElementById("main-container") );