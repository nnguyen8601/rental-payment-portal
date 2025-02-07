// Stripe Publishable Key (use your own key from your Stripe account)
const stripe = Stripe('pk_test_51QpuWqIoZ1ArbyYlO1Kny6CjFzKjrb1usugPbqH3LjqZhK8sYIDYQU9YM9JOH4fKfXWv6qinCbhRsaRMrWtZuGWo00IkikkKWL'); // Replace with your Stripe public key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Form and status elements
const paymentForm = document.getElementById('paymentForm');
const statusElement = document.getElementById('status');

// Submit the form when the user clicks 'Pay Now'
paymentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect input values
    const fullName = document.getElementById('fullName').value;
    const amount = document.getElementById('amount').value;

    // Create a token with Stripe Elements
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
        // Show the error message
        statusElement.innerText = `Error: ${error.message}`;
    } else {
        // Send the token to your server for processing
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token.id,
                amount: amount,
                fullName: fullName,
            }),
        });

        const result = await response.json();

        if (result.success) {
            statusElement.innerText = `Payment of $${amount} was successful! Thank you, ${fullName}!`;
        } else {
            statusElement.innerText = `Payment failed: ${result.error}`;
        }
    }
});
