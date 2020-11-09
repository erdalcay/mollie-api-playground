!function(){
  /**
   * Send a create payment request and redirect user to the payscreen URL
   */
  async function createPayment() {
    
    const [productId, amount, currency] = 
    [
      document.querySelector('.product__info .title span').innerText,
      document.querySelector('span[data-type="price"]').innerText,
      document.querySelector('span[data-type="currency"]').innerText
    ];

    $.ajax({
        url: `https://solutiongineer.com/api/create-payment?productId=${productId}&amount=${amount}&currency=${currency}`,
        type: 'GET',
        success: (response) => {
          if (response.error) {
            window.location.reload();
          }
          window.location.href = response.payscreenUrl;
        },
        error: (xhr, status) => {
          window.location.reload(); 
        }
    });
  }

  /**
   * Attach event to checkout button
   */
  document.querySelector('.buy--btn').addEventListener('click', createPayment);

}();