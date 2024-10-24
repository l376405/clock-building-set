import { settingsStore } from '@/store/settings';
import { storeToRefs } from 'pinia';

export function useExportHTML() {
    const settings = settingsStore();
    const {
        //fontFamily,
        timeFormat,
        numberImageUrls,
        separatorImageUrl,
        separatorRotation,
        separatorLeftMargin,
        separatorRightMargin,
        fontSelect,
        fontSizeSelect,
        textColor,
        textStrokeWidth,
        textStrokeColor,
        cssEditor,
        numberImageSize
    } = storeToRefs(settings);


    function exportHTML(preview, clock, objects) {
        const clockRect = clock.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(clock);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const borderLeft = parseFloat(computedStyle.borderLeftWidth);
        const borderRight = parseFloat(computedStyle.borderRightWidth);
        const borderTop = parseFloat(computedStyle.borderTopWidth);
        const borderBottom = parseFloat(computedStyle.borderBottomWidth);
        const durationMs = parseFloat(document.getElementById('digitAnimationDuration').value) * 1000;
        const clockWidth = Math.ceil(clockRect.width - paddingLeft - paddingRight - borderLeft - borderRight);
        const clockHeight = Math.ceil(clockRect.height - paddingTop - paddingBottom - borderTop - borderBottom);
        const digitAnimationCSS = composeDigitAnimation();
        const colonAnimationCSS = composeColonAnimation();
        const style = document.createElement('style');
        style.textContent = `
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #container {
                width: ${preview.offsetWidth}px;
                height: ${preview.offsetHeight}px;
                position: relative;
                overflow: hidden;
            }
            .clock {
                position: absolute;
                font-family: ${fontSelect.value};
                font-size: ${fontSizeSelect.value};
                color: ${textColor.value};
                -webkit-text-stroke: ${textStrokeWidth.value}px ${textStrokeColor.value};
                ${cssEditor.value}
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${clockWidth}px;
                height: ${clockHeight}px;
                padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
                border-width: ${borderTop}px ${borderRight}px ${borderBottom}px ${borderLeft}px;
                border-style: solid;
                border-color: ${computedStyle.borderColor};
                overflow: hidden;
            }
            .colon {
                display: inline-block;
                align-items: center;
                justify-content: center;
                line-height: 1;
                height: 1.2em;
                margin: 0 ${separatorLeftMargin.value}em 0 ${separatorRightMargin.value}em;
            }
            .clock-number, .clock-separator {
                width: ${numberImageSize.value}px;
                height: ${numberImageSize.value}px;
                object-fit: contain;
            }
            .ampm {
                display: inline-block;
                font-size: 0.5em;
                vertical-align: super;
                /*margin-left: 0.5em;*/
            }
            .space {
                display: inline-block;
                width: 0.5em;
            }
            ${digitAnimationCSS}
            ${colonAnimationCSS}
        `;

        //const previewRect = preview.getBoundingClientRect();
        const sortedObjects = objects.sort((a, b) => parseInt(a.element.style.zIndex) - parseInt(b.element.style.zIndex));

        const elementsHtml = sortedObjects.map(obj => {
            const rect = obj.element.getBoundingClientRect();
            const left = obj.element.offsetLeft;
            const top = obj.element.offsetTop;
            
            if (obj.type === 'clock') {
                const clockStyle = `
                    left: ${left}px;
                    top: ${top}px;
                    width: ${clockWidth}px;
                    height: ${clockHeight}px;
                    z-index: ${obj.element.style.zIndex};
                    `;
                return `<div class="clock" style="${clockStyle}">
                        <div id="ampm-indicator" class="ampm"></div>
                        <div id="ampm-space" class="space"></div>
                        <div class="digit" data-unit="hours-tens"><span>0</span></div>
                        <div class="digit" data-unit="hours-ones"><span>0</span></div>
                        <div class="colon">:</div>
                        <div class="digit" data-unit="minutes-tens"><span>0</span></div>
                        <div class="digit" data-unit="minutes-ones"><span>0</span></div>
                        <div class="colon">:</div>
                        <div class="digit" data-unit="seconds-tens"><span>0</span></div>
                        <div class="digit" data-unit="seconds-ones"><span>0</span></div>
                        </div>`;
                } else if (obj.type === 'image') {
                    const img = obj.element.querySelector('img');
                    return `<img src="${img.src}" alt="${img.alt}" style="position: absolute; left: ${left}px; top: ${top}px; width: ${rect.width}px; height: ${rect.height}px; object-fit: contain; z-index: ${obj.element.style.zIndex};">`;
                }
            }).join('');

            const htmlContent = `<!DOCTYPE html>
            <html lang="zh-TW">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>數字時鐘</title>
                <style>${style.textContent}</style>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Roboto&display=swap" rel="stylesheet">
            </head>
            <body>
                <div id="container">
                    ${elementsHtml}
                </div>

                <script>
                    const timeFormat = '${timeFormat.value}';
                    const numberImageUrls = ${JSON.stringify(numberImageUrls)};
                    const separatorImageUrl = '${separatorImageUrl}';
                    const numberImageSize = ${numberImageSize.value};
                    const separatorImageSize = ${separatorImageSize.value};
                    const separatorRotation = ${separatorRotation.value};
                    const separatorLeftMargin = ${separatorLeftMargin.value};
                    const separatorRightMargin = ${separatorRightMargin.value};
                    const durationMs = ${durationMs};
                    let lastUpdateTime = 0;

                    function updateClock() {
                        const now = new Date();
                        const currentTime = now.getTime();

                        if (currentTime - lastUpdateTime < 1000) {
                            requestAnimationFrame(updateClock);
                            return;
                        }

                        lastUpdateTime = currentTime;
                        const hours24 = String(now.getHours()).padStart(2, '0');
                        const hours12 = String(now.getHours() % 12 || 12).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        const seconds = String(now.getSeconds()).padStart(2, '0');
                        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
                        const ampmChinese = now.getHours() >= 12 ? '下午' : '上午';
                        const clockElement = document.querySelector('.clock');
                        const timeParts = {};
                        let showAmPm = false;
                        let ampmText = '';

                        switch (timeFormat) {
                            case 'HH:mm:ss':
                            case 'HH:mm':
                                timeParts['hours-tens'] = hours24[0];
                                timeParts['hours-ones'] = hours24[1];
                                timeParts['minutes-tens'] = minutes[0];
                                timeParts['minutes-ones'] = minutes[1];
                                if (timeFormat.includes('ss')) {
                                    timeParts['seconds-tens'] = seconds[0];
                                    timeParts['seconds-ones'] = seconds[1];
                                }
                                break;
                            case 'hh:mm:ss a':
                            case 'a hh:mm:ss':
                            case 'hh:mm a':
                            case 'a hh:mm':
                            case 'hh:mm:ss 上下午':
                            case '上下午 hh:mm:ss':
                            case 'hh:mm 上下午':
                            case '上下午 hh:mm':
                                timeParts['hours-tens'] = hours12[0];
                                timeParts['hours-ones'] = hours12[1];
                                timeParts['minutes-tens'] = minutes[0];
                                timeParts['minutes-ones'] = minutes[1];
                                if (timeFormat.includes('ss')) {
                                    timeParts['seconds-tens'] = seconds[0];
                                    timeParts['seconds-ones'] = seconds[1];
                                }
                                showAmPm = true;
                                ampmText = timeFormat.includes('a') ? ampm : ampmChinese;
                                break;
                            }

                            // 更新數字
                            for (const [unit, value] of Object.entries(timeParts)) {
                                updateDigit(unit, value);
                            }

                            // 更新分隔符和 AM/PM 指示器
                            const colonElements = clockElement.querySelectorAll('.colon');
                            const ampmElement = document.getElementById('ampm-indicator');
                            const ampmSpaceElement = document.getElementById('ampm-space');
                            colonElements.forEach((colon, index) => {
                                colon.style.display = index === 0 || (index === 1 && timeFormat.includes('ss')) ? 'inline-block' : 'none';
                            });

                            if (ampmElement && ampmSpaceElement) {
                                if (showAmPm) {
                                    ampmElement.textContent = ampmText;
                                    ampmElement.style.display = 'inline-block';
                                    ampmSpaceElement.style.display = 'inline-block';
                                } else {
                                    ampmElement.style.display = 'none';
                                    ampmSpaceElement.style.display = 'none';
                                }

                            if (timeFormat.startsWith('a') || timeFormat.startsWith('上下午')) {
                                clockElement.insertBefore(ampmSpaceElement, clockElement.firstChild);
                                clockElement.insertBefore(ampmElement, ampmSpaceElement);
                            } else {
                                clockElement.appendChild(ampmElement);
                                clockElement.insertBefore(ampmSpaceElement, ampmElement);
                            }

                            // 隱藏不需要的元素
                            clockElement.querySelectorAll('.digit').forEach(digit => {
                                digit.style.display = timeParts.hasOwnProperty(digit.dataset.unit) ? 'inline-block' : 'none';
                            });

                            requestAnimationFrame(updateClock);
                        }

                        function updateDigit(unit, value) {
                            const digitElement = document.querySelector(\`.digit[data-unit="\${unit}"]\`);
                            if (!digitElement) return;

                            const currentElement = digitElement.firstElementChild;
                            const currentContent = currentElement ? (currentElement.textContent || currentElement.querySelector('img')?.alt) : null;

                            console.log(\`Updating \${unit}: current=\${currentContent}, new=\${value}\`);

                            if (currentContent !== value) {
                                console.log(\`\${unit} is changing from \${currentContent} to \${value}\`);

                                // 將所有現有元素標記為舊元素
                                digitElement.childNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        node.classList.add('old');
                                    }
                                });

                                // 創建新的 span 元素
                                const newSpan = document.createElement('span');
                                if (numberImageUrls[value]) {
                                    const img = document.createElement('img');
                                    img.src = numberImageUrls[value];
                                    img.alt = value;
                                    img.className = 'clock-number';
                                    img.style.width = \`\${numberImageSize}px\`;
                                    img.style.height = \`\${numberImageSize}px\`;
                                    img.style.objectFit = 'contain';
                                    newSpan.appendChild(img);
                                } else {
                                    newSpan.textContent = value;
                                }

                                newSpan.classList.add('new');
                                digitElement.appendChild(newSpan);

                                void digitElement.offsetWidth; // 觸發重排

                                digitElement.classList.add('changing');

                                setTimeout(() => {
                                    // 移除所有舊元素
                                    digitElement.querySelectorAll('.old').forEach(el => el.remove());
                                    newSpan.classList.remove('new');
                                    digitElement.classList.remove('changing');
                                }, durationMs); // 使用動畫時間
                            } else {
                                console.log(\`\${unit} remains unchanged\`);
                            }
                        }

                        updateClock();
                    </script>
                </body>
            </html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'digital_clock.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return {
        exportHTML
    };
}