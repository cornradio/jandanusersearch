// ==UserScript==
// @name         煎蛋用户名搜索
// @name:en      JandanUserSearch
// @namespace    https://github.com/cornradio/jandan-user-search
// @version      1.0.0
// @description  在煎蛋网页添加用户名搜索功能，支持自动翻页查找
// @description:en  Add username search function to jandan.net with auto-page-turning
// @author       您的名字
// @match        https://jandan.net/*
// @license      MIT
// @icon         https://jandan.net/favicon.ico
// @grant        none
// @supportURL   https://github.com/cornradio/jandan-user-search/issues
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个容器来放置搜索框和按钮
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.gap = '5px';

    // 在创建搜索框之前添加计数器和当前索引变量
    const counter = document.createElement('span');
    counter.textContent = '0/0';
    counter.style.padding = '8px';
    counter.style.color = '#666';
    counter.style.fontSize = '14px';
    counter.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    counter.style.border = '1px solid #ccc';
    counter.style.borderRadius = '4px';

    // 搜索框
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = '请输入用户名';
    search.style.padding = '8px';
    search.style.border = '1px solid #ccc';
    search.style.borderRadius = '4px';
    search.style.backgroundColor = 'white';
    search.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    // 搜索按钮
    const searchBtn = document.createElement('button');
    searchBtn.textContent = '搜索';
    searchBtn.style.padding = '8px 12px';
    searchBtn.style.border = '1px solid #ccc';
    searchBtn.style.borderRadius = '4px';
    searchBtn.style.backgroundColor = '#4CAF50';
    searchBtn.style.color = 'white';
    searchBtn.style.cursor = 'pointer';
    // 添加提示
    search.title = '自动搜素当前页，如果没有自动翻页';

    // 添加一个变量来跟踪当前匹配的索引
    let currentMatchIndex = -1;
    let currentMatches = [];

    // 修改搜索功能
    async function searchUsername() {
        // 移除之前的高亮
        document.querySelectorAll('.highlight-author').forEach(el => {
            el.classList.remove('highlight-author');
        });

        const username = search.value.trim();
        if (!username) {
            counter.textContent = '0/0';
            currentMatches = [];
            currentMatchIndex = -1;
            return;
        }

        const authors = document.querySelectorAll('.author');
        currentMatches = Array.from(authors).filter(author => 
            author.textContent.includes(username)
        );

        if (currentMatches.length > 0) {
            // 如果是新的搜索，重置索引
            if (currentMatchIndex === -1) {
                currentMatchIndex = 0;
            } else {
                // 移动到下一个匹配
                currentMatchIndex++;
                // 如果已经是最后一个匹配，则跳转到下一页
                if (currentMatchIndex >= currentMatches.length) {
                    const nextPageLink = document.querySelector('.previous-comment-page');
                    if (nextPageLink) {
                        sessionStorage.setItem('searchUsername', username);
                        sessionStorage.setItem('autoSearch', 'true');
                        nextPageLink.click();
                        return;
                    } else {
                        alert('已到最后一页，未找到更多结果');
                        currentMatchIndex = currentMatches.length - 1;
                    }
                }
            }

            // 更新计数器显示当前位置/匹配总数
            counter.textContent = `${currentMatchIndex + 1}/${currentMatches.length}`;

            // 高亮并滚动到当前匹配
            currentMatches.forEach((match, index) => {
                match.classList.add('highlight-author');
                if (index === currentMatchIndex) {
                    match.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        } else {
            counter.textContent = '0/0';
            currentMatchIndex = -1;
            const nextPageLink = document.querySelector('.previous-comment-page');
            if (nextPageLink) {
                sessionStorage.setItem('searchUsername', username);
                sessionStorage.setItem('autoSearch', 'true');
                nextPageLink.click();
            } else {
                alert('已到最后一页，未找到该用户名');
            }
        }
    }

    // 页面加载完成后检查是否需要自动搜索
    function checkAutoSearch() {
        const autoSearch = sessionStorage.getItem('autoSearch');
        const searchUsername = sessionStorage.getItem('searchUsername');
        
        if (autoSearch === 'true' && searchUsername) {
            // 清除自动搜索标记
            sessionStorage.removeItem('autoSearch');
            
            // 设置搜索框的值
            search.value = searchUsername;
            
            // 缩短延迟时间，加快搜索速度
            setTimeout(() => {
                searchUsername();
            }, 500);
        }
    }

    // 添加高亮样式
    const style = document.createElement('style');
    style.textContent = `
        .highlight-author {
            background-color: yellow !important;
            padding: 2px 5px !important;
            border-radius: 3px !important;
        }
    `;
    document.head.appendChild(style);

    // 添加事件监听
    searchBtn.addEventListener('click', searchUsername);
    search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchUsername();
        }
    });

    // 修改container样式
    container.style.alignItems = 'center';

    // 修改元素添加顺序
    container.appendChild(counter);
    container.appendChild(search);
    container.appendChild(searchBtn);
    document.body.appendChild(container);

    // 检查是否需要自动搜索
    checkAutoSearch();
})(); 