const stripe = Stripe('pk_test_51QpuWqIoZ1ArbyYlO1Kny6CjFzKjrb1usugPbqH3LjqZhK8sYIDYQU9YM9JOH4fKfXWv6qinCbhRsaRMrWtZuGWo00IkikkKWL'); // Add your Stripe publishable key here
const elements = stripe.elements();

// Create an instance of the card Element
const card = elements.create('card');
card.mount('#card-element');

// Handle form submission
const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable the submit button to prevent multiple submissions
    const submitButton = paymentForm.querySelector('button');
    submitButton.disabled = true;

    const fullName = document.getElementById('fullName').value;
    const amount = document.getElementById('amount').value;

    // Create a payment method (token)
    const { token, error } = await stripe.createToken(card);

    if (error) {
        // Show error in the UI
        document.getElementById('card-errors').textContent = error.message;
        submitButton.disabled = false;
        return;
    }

    // Send the token and amount to your backend to create a payment intent
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token.id, // Send the token id to the backend
                amount: amount
            })
        });

        const data = await response.json();

        if (data.success) {
            const clientSecret = data.clientSecret;
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: fullName,
                    },
                },
            });

            if (error) {
                document.getElementById('card-errors').textContent = error.message;
            } else if (paymentIntent.status === 'succeeded') {
                document.getElementById('status').textContent = 'Payment successful!';
            }
        } else {
            document.getElementById('card-errors').textContent = data.error || 'Payment failed';
        }
    } catch (error) {
        console.error('Payment error:', error);
        document.getElementById('card-errors').textContent = error.message;
    }

    submitButton.disabled = false;
});
