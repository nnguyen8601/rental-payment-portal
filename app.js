document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let fullName = document.getElementById('fullName').value;
    let amount = document.getElementById('amount').value;
    let paymentMethod = document.getElementById('paymentMethod').value;
    let cardNumber = document.getElementById('cardNumber').value;

    if (!fullName || !amount || !paymentMethod || (paymentMethod === 'creditCard' && !cardNumber)) {
        alert("Please fill all fields correctly.");
        return;
    }

    document.getElementById('status').innerText = `Processing payment for ${fullName}...`;

    // Simulating a payment process
    setTimeout(() => {
        document.getElementById('status').innerText = `Payment of $${amount} was successful! Thank you, ${fullName}!`;
    }, 2000);
});
