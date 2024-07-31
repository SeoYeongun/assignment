//Dom이 완전히 로드된후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 심리테스트 폼 요소 가져오기
    const form = document.getElementById('psych-form');
    // 폼이 존재하는 경우에만 if문 실행
    if (form) {
        // 폼 제출 이벤트에 대한 리스너
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 결과를 표시할 요소들 가져오기
            const resultTextElement = document.getElementById('result-text');
            const poeticResultElement = document.getElementById('poetic-result');
            
            // 분석 중 메시지 표시
            if (resultTextElement) {
                resultTextElement.textContent = "분석 중...";
            }
            if (poeticResultElement) {
                poeticResultElement.innerHTML = "";
            }
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            
            // 폼 데이터를 문자열로 변환
            let userInput = "";
            for (let [key, value] of formData.entries()) {
                userInput += `${key}: ${value}\n`;
            }
            
            // API 요청 데이터 준비
            const apiData = [
                {"role": "system", "content": "assistant는 심리학자이다. 각 질문 조항에대하여 차례대로 심리학자의 관점에서 전문적인 답변을 주고 주어진 심리 테스트 결과를 분석한다, 그 결과를 분석하고 현재 고민에 대하여 조언해주세요 만약 바뀔점이 있다면 순서대로 바뀔점을 조언해주세요."},
                {"role": "user", "content": `다음은 심리 테스트 결과입니다. 이를 분석하고 전문적인 관점에서 결과를 보여주세요:\n${userInput}`}
            ]

            try {
                // API에 POST 요청 보내기
                const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiData),
                });

                // 응답이 성공적이지 않으면 에러 발생
                if (!response.ok) {
                    throw new Error('API 요청에 실패했습니다.');
                }

                // 응답 데이터 파싱
                const data = await response.json();
                const poeticResult = data.choices[0].message.content;

                // 분석 완료 메시지 표시
                if (resultTextElement) {
                    resultTextElement.textContent = "분석이 완료되었습니다.";
                } else {
                    console.error('result-text element not found');
                }

                if (poeticResultElement) {
                    poeticResultElement.innerHTML = poeticResult.replace(/\n/g, '<br>');
                } else {
                    console.error('poetic-result element not found');
                    // 대안으로, 결과를 result-text 요소에 추가
                    if (resultTextElement) {
                        resultTextElement.innerHTML += '<br><br>' + poeticResult.replace(/\n/g, '<br>');
                    }
                }
            } catch (error) {
                console.error('에러:', error);
                if (resultTextElement) {
                    resultTextElement.textContent = "결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.";
                } else {
                    console.error('result-text element not found');
                }
            }
        });
    } else {
        console.error('Form element not found');
    }
});