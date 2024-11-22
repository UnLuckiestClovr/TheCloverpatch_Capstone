try {
    document.getElementById('LogoutBTN').addEventListener('click', async function() {
        const response = await fetch('/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok) {
            console.log("Logged Out")
            window.location.href = "/LoginorRegister"
        } else {
            console.log("Issue within Logout")
        }
    })

    // ARTICLE TABS
    function showArticle(articleId) {
        // Hide all articles
        const articles = document.querySelectorAll('.baskArticle');
        articles.forEach(article => {
            article.classList.remove('active');
        });
    
        // Show the selected article
        const selectedArticle = document.getElementById(articleId);
        selectedArticle.classList.add('active');
    
        // Update active tab
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = Array.from(tabs).find(tab => tab.id === articleId.replace('View', 'Tab'));
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    document.getElementById('FlowerBasketTab').addEventListener('click', () => {
        showArticle('FlowerBasketView')
    })
    
    document.getElementById('FoodBasketTab').addEventListener('click', () => {
        showArticle('FoodBasketView')
    })
} catch (error) {}