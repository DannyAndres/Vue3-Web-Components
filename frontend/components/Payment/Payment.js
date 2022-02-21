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
      let test2 = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsd="http://www.w3.org/1999/XMLSchema">
          <SOAP-ENV:Header>
          <eb:MessageHeader SOAP-ENV:mustUnderstand="1" eb:version="1.0">
          <eb:From>
          <eb:PartyId type="urn:x12.org:IO5:01">999999</eb:PartyId>
          </eb:From>
          <eb:To>
          <eb:PartyId type="urn:x12.org:IO5:01">123123</eb:PartyId>
          </eb:To>
          <eb:ConversationId>abc123</eb:ConversationId>
          <eb:CPAId>Sabre</eb:CPAId>
          <eb:Service eb:type="string">Session</eb:Service>
          <eb:Action>SessionCreateRQ</eb:Action>
          <eb:MessageData>
          <eb:MessageId>99999999</eb:MessageId>
          <eb:Timestamp>2001-02-15T11:15:12Z</eb:Timestamp>
          <eb:TimeToLive>2001-02-15T11:15:12Z</eb:TimeToLive>
          </eb:MessageData>
          </eb:MessageHeader>
          <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext" xmlns:wsu="http://schemas.xmlsoap.org/ws/2002/12/utility">
          <wsse:UsernameToken>
          <wsse:Username></wsse:Username>
          <wsse:Password></wsse:Password>
          <Organization></Organization>
          <Domain></Domain>
          </wsse:UsernameToken>
          </wsse:Security>
          </SOAP-ENV:Header>
          <SOAP-ENV:Body>
          <SessionCreateRQ>
          <POS>
          <Source PseudoCityCode="IM07"/>
          </POS>
          </SessionCreateRQ>
          </SOAP-ENV:Body>
          </SOAP-ENV:Envelope>`;

      axios
        .post('https://sws-sts.cert.sabre.com/', test2, {
          headers: { 'Content-Type': 'text/xml' },
        })
        .then((res1) => {
          console.log(res1);
        })
        .catch((err1) => {
          console.log(err1);
        });
    };

    do_payment();

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
