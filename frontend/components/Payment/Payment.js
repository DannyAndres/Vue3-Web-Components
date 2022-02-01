const { defineCustomElement, reactive, watch } = Vue;

export const PaymentElement = defineCustomElement({
  // normal Vue component options here
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
  emits: {},
  template: `
    <div class='payment-component-container'>
      <div v-if='data.error' class='payment-component-error payment-component-margin payment-component-full-width'>
        {{ data.error }}
      </div>
      <div class='payment-component-margin payment-component-full-width'>
        <label class='payment-component-label'>Card Number</label>
        <input class='payment-component-input' v-model="data.card" placeholder="5555555555554444" />
      </div>
      <label class='payment-component-label'>Expiration date</label>
      <div class="payment-component-full-width payment-component-margin payment-component-date">
        <input class='payment-component-input' v-model="data.month" placeholder="01" />
        <input class='payment-component-input' v-model="data.year" placeholder="28" />
      </div>
      <div class='payment-component-margin payment-component-full-width'>
        <label class='payment-component-label'>Security Code</label>
        <input class='payment-component-input' v-model="data.cvv" placeholder="CVV" />
      </div>
      <div class='payment-component-full-width'>
        <button class='payment-component-button' @click.prevent='submit()'>
          Submit
        </button>
      </div>
    </div>
  `,
  setup(props) {
    console.log('payment component loaded');
    const data = reactive({
      card: '',
      month: '',
      year: '',
      cvv: '',
      error: '',
    });

    const do_payment = () => {
      let xmls =
        '<PaymentRQ xmlns="http://www.opentravel.org/OTA/2003/05/beta" SystemDateTime="2021-01-14T13:40:00" Version="4.28.0" xmlns:xsi="http:/www.w3.org/2001/XMLSchema-instance">\
        <Action>Tokenize</Action>\
        <PaymentDetail>\
          <FOP Type="CC"/>\
          <PaymentCard CardNumber="' +
        data.card +
        '"/>\
        </PaymentDetail>\
        </PaymentRQ>';

      axios
        .post('http://www.webservicex.com/CurrencyConvertor.asmx?wsdl', xmls, {
          headers: { 'Content-Type': 'text/xml' },
        })
        .then((res1) => {
          console.log(res1);
          let xmls_auth =
            '<ns8:PaymentRQ xmlns:ns8="http://www.opentravel.org/OTA/2003/05/beta" xmlns:ns7="http://www.w3.org/2000/09/xmldsig#" xmlns:ns6="http://schemas.xmlsoap.org/ws/2002/12/secext" xmlns:ns5="http://www.w3.org/1999/xlink" xmlns:ns4="http://www.ebxml.org/namespaces/messageHeader" SystemDateTime="2022-01-14T18:58:19.574Z" Version="3.0.0">\
              <ns8:Action>Auth</ns8:Action>\
              <ns8:POS PseudoCityCode="WIN" LNIATA="35AE80" StationNumber="99401013" ISOCountry="AU" IP_Address="10.230.56.48" ChannelID="WEB" LocalDateTime="2022-01-14T18:58:19.575Z" LanguageCode="en_GB">\
                <ns8:BrowserDetail BrowserSessionID="b3c32192-0209-40ca-9227-1b802f1a52c5-TargetGroupA" BrowserHostName="api-crt.as.cert.havail.sabre.com" BrowserAccept="application/json" BrowserAcceptEncoding="gzip" BrowserID="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36" BrowserLanguageCode="en-US,en;q=0.9" BrowserCookie="visid_incap_1820919=m51yMXpkSYKSZYraiNq/+rwcqWEAAAAAQUIPAAAAAAA4t0niOJxvsKJe8MwP+fjl; visid_incap_1446254=Qd2xhFPySF2NFGoVIdRYTYpgqmEAAAAAQUIPAAAAAAD9y7Ow8i2DmzB3JxZQ/R03; apt.uid=AP-GAADVBJPNBLE-2-1638568673580-36381321.0.0; amp_005737=MBFRcAnXtM68eqpaD" BrowserReferer="http://api-crt.as.cert.havail.sabre.com/api/purchase"/>\
              </ns8:POS>\
              <ns8:MerchantDetail MerchantID="VA" MerchantName="Virgin Australia"/>\
              <ns8:OrderDetail SessionID="b3c32192-0209-40ca-9227-1b802f1a52c5-TargetGroupA" OrderID="TYFSWR140122" OrderType="O" RecordLocator="TYFSWR" DollarAmountPaid="0" ThirdPartyBookingInd="true" OneWayInd="false">\
                <ns8:ProductDetail ProductID="0001" CurrencyCode="AUD" UnitPrice="464.20" Taxes="130.90" Fees="0.00" Quantity="1"/>\
                <ns8:ProductDetail ProductID="1004" CurrencyCode="AUD" UnitPrice="45.00" Taxes="4.09" Fees="0.00" Quantity="1"/>\
                <ns8:PassengerDetail NameInPNR="fd/gf MRS*ADT" PsgrType="ADT" FirstName="gf" LastName="fd">\
                  <ns8:Document DocType="TKT" eTicketInd="true" BaseFare="333.30" Taxes="130.90" Fees="0.00"/>\
                  <ns8:Document DocType="EMD" DocTypeDescription="LOUNGE EXPERIENCE" eTicketInd="true" DocCurrency="AUD" DocAmount="45.00" RFI_Code="E"/>\
                </ns8:PassengerDetail>\
                <ns8:ContactInfo>\
                  <ns8:EmailAddress>fd@gamil.com</ns8:EmailAddress>\
                  <ns8:PhoneNumber Number="61-9#####9999" Type="M"/>\
                </ns8:ContactInfo>\
                <ns8:FlightDetail>\
                  <ns8:AirlineCode>VA</ns8:AirlineCode>\
                  <ns8:FlightNumber>1559</ns8:FlightNumber>\
                  <ns8:ClassOfService>S</ns8:ClassOfService>\
                  <ns8:DepartureInfo DepartureAirport="HBA" DepartureDateTime="2022-02-12T09:00:00" CurrentLocalDateTime="2022-01-15T05:58:19"/>\
                  <ns8:ArrivalInfo ArrivalAirport="SYD" ArrivalDateTime="2022-02-12T10:50:00" FinalDestinationInd="false"/>\
                </ns8:FlightDetail>\
                <ns8:FlightDetail>\
                  <ns8:AirlineCode>VA</ns8:AirlineCode>\
                  <ns8:FlightNumber>1421</ns8:FlightNumber>\
                  <ns8:ClassOfService>S</ns8:ClassOfService>\
                  <ns8:DepartureInfo DepartureAirport="SYD" DepartureDateTime="2022-02-12T14:10:00" CurrentLocalDateTime="2022-01-15T05:58:19"/>\
                  <ns8:ArrivalInfo ArrivalAirport="CNS" ArrivalDateTime="2022-02-12T16:15:00" FinalDestinationInd="true"/>\
                </ns8:FlightDetail>\
                <ns8:FlightDetail>\
                  <ns8:AirlineCode>VA</ns8:AirlineCode>\
                  <ns8:FlightNumber>770</ns8:FlightNumber>\
                  <ns8:ClassOfService>S</ns8:ClassOfService>\
                  <ns8:DepartureInfo DepartureAirport="CNS" DepartureDateTime="2022-02-19T05:55:00" CurrentLocalDateTime="2022-01-15T04:58:19"/>\
                  <ns8:ArrivalInfo ArrivalAirport="BNE" ArrivalDateTime="2022-02-19T08:15:00" FinalDestinationInd="false"/>\
                </ns8:FlightDetail>\
                <ns8:FlightDetail>\
                  <ns8:AirlineCode>VA</ns8:AirlineCode>\
                  <ns8:FlightNumber>1555</ns8:FlightNumber>\
                  <ns8:ClassOfService>S</ns8:ClassOfService>\
                  <ns8:DepartureInfo DepartureAirport="BNE" DepartureDateTime="2022-02-19T12:00:00" CurrentLocalDateTime="2022-01-15T04:58:19"/>\
                  <ns8:ArrivalInfo ArrivalAirport="HBA" ArrivalDateTime="2022-02-19T15:55:00" FinalDestinationInd="false"/>\
                </ns8:FlightDetail>\
              </ns8:OrderDetail>\
              <ns8:PaymentDetail>\
                <ns8:FOP Type="CC"/>\
                <ns8:PaymentCard CardCode="CA" CardNumber="510000######0040" CardSecurityCode="###" T3DS_Ind="false" ExpireDate="######">\
                  <ns8:CardHolderName Name="abc def"/>\
                  <ns8:Address>\
                    <ns8:AddressLine1>123 abc def</ns8:AddressLine1>\
                    <ns8:CityName>abc def</ns8:CityName>\
                    <ns8:PostalCode>34567</ns8:PostalCode>\
                    <ns8:StateProv StateCode="ACT"/>\
                    <ns8:Country Code="AU"/>\
                  </ns8:Address>\
                  <ns8:Authenticated>false</ns8:Authenticated>\
                </ns8:PaymentCard>\
                <ns8:AmountDetail Amount="509.20" CurrencyCode="AUD"/>\
                <ns8:ReturnURLs>\
                  <ns8:DefaultURL>https://dx.dx13.cert.aws.sabre.com/dx/VADX/api/remoteReturn?pathname=/payment&amp;journeyType=round-trip&amp;activeMonth=02-12-2022&amp;direction=1&amp;awardBooking=false&amp;class=Economy&amp;ADT=1&amp;CHD=0&amp;INF=0&amp;origin=HBA&amp;destination=CNS&amp;date=02-12-2022&amp;origin1=CNS&amp;destination1=HBA&amp;date1=02-19-2022&amp;flight=-2046670218&amp;flight1=1408266444&amp;execution=e46e1daf-eb3a-4a97-91c1-1a399a3f93aa&amp;fasterCheckout=false&amp;paymentType=THIRD_PARTY_REDIRECT_INFO&amp;paymentStatus=DEFAULT&amp;currentFlow=b2c&amp;amount=509.2&amp;currency=AUD</ns8:DefaultURL>\
                  <ns8:ApprovedURL>https://dx.dx13.cert.aws.sabre.com/dx/VADX/api/remoteReturn?pathname=/payment&amp;journeyType=round-trip&amp;activeMonth=02-12-2022&amp;direction=1&amp;awardBooking=false&amp;class=Economy&amp;ADT=1&amp;CHD=0&amp;INF=0&amp;origin=HBA&amp;destination=CNS&amp;date=02-12-2022&amp;origin1=CNS&amp;destination1=HBA&amp;date1=02-19-2022&amp;flight=-2046670218&amp;flight1=1408266444&amp;execution=e46e1daf-eb3a-4a97-91c1-1a399a3f93aa&amp;fasterCheckout=false&amp;paymentType=THIRD_PARTY_REDIRECT_INFO&amp;paymentStatus=APPROVED&amp;currentFlow=b2c&amp;amount=509.2&amp;currency=AUD</ns8:ApprovedURL>\
                  <ns8:DeclinedURL>https://dx.dx13.cert.aws.sabre.com/dx/VADX/api/remoteReturn?pathname=/payment&amp;journeyType=round-trip&amp;activeMonth=02-12-2022&amp;direction=1&amp;awardBooking=false&amp;class=Economy&amp;ADT=1&amp;CHD=0&amp;INF=0&amp;origin=HBA&amp;destination=CNS&amp;date=02-12-2022&amp;origin1=CNS&amp;destination1=HBA&amp;date1=02-19-2022&amp;flight=-2046670218&amp;flight1=1408266444&amp;execution=e46e1daf-eb3a-4a97-91c1-1a399a3f93aa&amp;fasterCheckout=false&amp;paymentType=THIRD_PARTY_REDIRECT_INFO&amp;paymentStatus=DECLINED&amp;currentFlow=b2c&amp;amount=509.2&amp;currency=AUD</ns8:DeclinedURL>\
                  <ns8:PendingURL>https://dx.dx13.cert.aws.sabre.com/dx/VADX/api/remoteReturn?pathname=/payment&amp;journeyType=round-trip&amp;activeMonth=02-12-2022&amp;direction=1&amp;awardBooking=false&amp;class=Economy&amp;ADT=1&amp;CHD=0&amp;INF=0&amp;origin=HBA&amp;destination=CNS&amp;date=02-12-2022&amp;origin1=CNS&amp;destination1=HBA&amp;date1=02-19-2022&amp;flight=-2046670218&amp;flight1=1408266444&amp;execution=e46e1daf-eb3a-4a97-91c1-1a399a3f93aa&amp;fasterCheckout=false&amp;paymentType=THIRD_PARTY_REDIRECT_INFO&amp;paymentStatus=PENDING&amp;currentFlow=b2c&amp;amount=509.2&amp;currency=AUD</ns8:PendingURL>\
                </ns8:ReturnURLs>\
              </ns8:PaymentDetail>\
            </ns8:PaymentRQ>';
          axios
            .post(
              'http://www.webservicex.com/CurrencyConvertor.asmx?wsdl',
              xmls_auth,
              {
                headers: { 'Content-Type': 'text/xml' },
              }
            )
            .then((res2) => {
              console.log(res2);
            })
            .catch((err2) => {
              console.log(err2);
            });
        })
        .catch((err1) => {
          console.log(err1);
        });
    };

    const submit = () => {
      data.error = '';
      let visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
      let mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
      let amexpRegEx = /^(?:3[47][0-9]{13})$/;
      let discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
      let isValid = false;

      if (visaRegEx.test(data.card)) {
        isValid = true;
      } else if (mastercardRegEx.test(data.card)) {
        isValid = true;
      } else if (amexpRegEx.test(data.card)) {
        isValid = true;
      } else if (discovRegEx.test(data.card)) {
        isValid = true;
      }

      if (isValid && data.card && data.month && data.year && data.cvv) {
        do_payment();
      } else {
        data.error = 'Please provide a valid Visa!';
      }
    };

    watch(data, (currentValue, oldValue) => {
      let onlyNumbers = /^[0-9]+$/;
      // card
      if (!onlyNumbers.test(data.card)) {
        data.card = data.card.replace(/\D/g, '');
      }
      if (data.card.length > 16) {
        data.card = data.card.substring(0, 16);
      }
      // month
      if (!onlyNumbers.test(data.month)) {
        data.month = data.month.replace(/\D/g, '');
      }
      if (data.month.length > 2) {
        data.month = data.month.substring(0, 2);
      }
      if (parseInt(data.month) > 12) {
        data.month = '12';
      }
      // year
      if (!onlyNumbers.test(data.year)) {
        data.year = data.year.replace(/\D/g, '');
      }
      if (data.year.length > 2) {
        data.year = data.year.substring(0, 2);
      }
      // cvv
      if (!onlyNumbers.test(data.cvv)) {
        data.cvv = data.cvv.replace(/\D/g, '');
      }
      if (data.cvv.length > 3) {
        data.cvv = data.cvv.substring(0, 3);
      }
    });

    return {
      data,
      submit,
    };
  },
  styles: [
    `
    .payment-component-input {
      display: flex;
      height: 3rem;
      box-sizing: border-box;
      padding-left: 1em;
      padding-right: 1em;
      width: 100%;
      color: #0f172a;
      background-color: #f8fafc;
      background-clip: padding-box;
      border: 1px solid #e2e8f0;
      outline: 0;
      border-radius: 0.25rem;
      transition: border 0.3s ease-in-out;
    }
    .payment-component-input:focus {
      border: 1px solid #0f172a;
      background-color: #f1f5f9;
      outline: 0;
    }
    .payment-component-button {
      font-family: Whitney, "Open Sans", Helvetica, sans-serif;
      width: 100%;
      background-color: #334155;
      border-radius: 0.25rem;
      font-weight: 400;
      color: #f1f5f9;
      font-size: 11pt;
      cursor: pointer;
      padding-top: 1em;
      padding-bottom: 1em;
      outline:none;
      border: 0 none;
      transition: background 250ms ease-in-out, transform 150ms ease;
    }
    .payment-component-error {
      font-family: Whitney, "Open Sans", Helvetica, sans-serif;
      width: 100%;
      background-color: #f87171;
      border-radius: 0.25rem;
      font-weight: 400;
      color: #f1f5f9;
      font-size: 11pt;
      cursor: pointer;
      padding-top: 1em;
      padding-bottom: 1em;
      outline:none;
      border: 0 none;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .payment-component-label {
      font-family: Whitney, "Open Sans", Helvetica, sans-serif;
      color: #475569;
      font-size: 11pt;
      width: 100%;
      text-align: left;
    }
    .payment-component-button:hover {
      background-color: #64748b;
    }
    .payment-component-full-width {
      width: 100%;
    }
    .payment-component-margin {
      margin-bottom: 1em;
    }
    .payment-component-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .payment-component-date {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1em;
    }
  `,
  ],
});

const defineComponent = (name, component) => {
  // Register the custom element.
  // After registration, all `<my-vue-element>` tags
  // on the page will be upgraded.
  customElements.define(name, component);
};

export default defineComponent;
