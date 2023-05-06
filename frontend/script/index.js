

// Allowing the user only if logged In

const token = sessionStorage.getItem("token") || null;
    function checkValidation()
    {
        if(!token)
        {
            alert('Please Login to Continue');
        }else{
            location.reload();
            window.location.href = 'dashboard.html';
        }
    }