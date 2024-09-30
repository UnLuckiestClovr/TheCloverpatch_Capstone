// - - - - - - Questionaire Script - - - - - - - - - - - - - - - - - - - - - - - - - - - -
try {
    const questionsInvalid = document.getElementById('questionInvalidOutput')
    
    subQuestionAnswersBTN.addEventListener('click', async function () {
        const q1 = document.getElementById('question1')
        const q2 = document.getElementById('question2')
        const q3 = document.getElementById('question3')
    
        if(q1.value === "" || q2.value === "" || q3.value === "") {
            invalidQuestionaire(q1.value, q2.value, q3.value)
            return
        }
        questionsInvalid.innerHTML = ""
    
        const questionAnswers = {
            q1Ans: q1.value,
            q2Ans: q2.value,
            q3Ans: q3.value
        }
    
        try{
            const response = await fetch('/users/updatequestionaire', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionAnswers)
            })
        } catch (error) {
            
        }
    })
    
    function invalidQuestionaire(ans1, ans2, ans3) {
        let textVar = "<article style='color: red'>"
        if(ans1 === "") {
            textVar += "<p> Question 1 Requires Input </p>"
        }
        if(ans2 === "") {
            textVar += "<p> Question 2 Requires Input </p>"
        }
        if(ans3 === "") {
            textVar += "<p> Question 3 Requires Input </p>"
        }
        textVar += "</article>"
        questionsInvalid.innerHTML = textVar
    }
    
    try {
    
        document.getElementById('SubmitQuestionaire').addEventListener('click', async() => {
            console.log("Update Submitted")
    
            const q1 = document.getElementById('question1')
            const q2 = document.getElementById('question2')
            const q3 = document.getElementById('question3')
    
            if(q1.value === "" && q2.value === "" && q3.value === "") {
                console.log("No Values Inputted")
                return
            }
            questionsInvalid.innerHTML = ""
    
            const questionAnswers = {
                q1Ans: q1.value,
                q2Ans: q2.value,
                q3Ans: q3.value
            }
    
            try{
                const response = await fetch('/users/updatequestionaire', {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(questionAnswers)
                })
                if(response.ok) {
                    console.log("Info Updated")
                    window.location.href = "/profile"
                } else {
                    console.log("Issue within DAL")
                }
            } catch (error) {
                console.log(error)
                console.log("Error Updating Info")
            }
        })
    } catch (error) {}
    } catch (error) {}