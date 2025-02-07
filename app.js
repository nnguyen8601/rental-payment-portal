// Stripe public key (you can get this from your Stripe Dashboard)
const stripe = Stripe('pk_test_51QpuWqIoZ1ArbyYlO1Kny6CjFzKjrb1usugPbqH3LjqZhK8sYIDYQU9YM9JOH4fKfXWv6qinCbhRsaRMrWtZuGWo00IkikkKWL'); // Replace with your actual public key
const elements = stripe.elements();

// Create an instance of the Card Element
const card = elements.create('card');

// Mount the Card Element to the div with id 'card-element'
card.mount('#card-element');

// Handle form submission
const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Disable the submit button to prevent multiple submissions
    const submitButton = paymentForm.querySelector('button');
    submitButton.disabled = true;

    // Get the amount and full name from the form fields
    const fullName = document.getElementById('fullName').value;
    const amount = document.getElementById('amount').value;

    // Create a PaymentIntent on the server (you need to implement this API)
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
            }),
        });

        const { clientSecret } = await response.json();

        // Confirm the payment on the client-side
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: fullName,
                },
            },
        });

        if (error) {
            // Display error in the #card-errors div
            const cardErrors = document.getElementById('card-errors');
            cardErrors.textContent = error.message;
            submitButton.disabled = false;  // Re-enable the submit button
        } else if (paymentIntent.status === 'succeeded') {
            // Payment succeeded, update the status message
            const statusMessage = document.getElementById('status');
            statusMessage.textContent = 'Payment successful!';
        }
    } catch (error) {
        // Handle any errors from the backend or Stripe
        console.error('Payment error:', error);
        submitButton.disabled = false;  // Re-enable the submit button
    }
});
