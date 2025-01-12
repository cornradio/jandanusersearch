// ==UserScript==
// @name         煎蛋用户名搜索
// @name:en      JandanUserSearch
// @namespace    https://github.com/您的用户名/jandan-user-search
// @version      1.0.0
// @description  在煎蛋网页添加用户名搜索功能，支持自动翻页查找
// @description:en  Add username search function to jandan.net with auto-page-turning
// @author       您的名字
// @match        https://jandan.net/*
// @license      MIT
// @icon         https://jandan.net/favicon.ico
// @grant        none
// @supportURL   https://github.com/您的用户名/jandan-user-search/issues
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

    // 搜索功能
    async function searchUsername() {
        // 移除之前的高亮
        document.querySelectorAll('.highlight-author').forEach(el => {
            el.classList.remove('highlight-author');
        });

        const username = search.value.trim();
        if (!username) return;

        const authors = document.querySelectorAll('.author');
        let found = false;

        for (const author of authors) {
            if (author.textContent.includes(username)) {
                found = true;
                // 高亮匹配的用户名
                author.classList.add('highlight-author');
                // 滚动到第一个匹配的位置
                author.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            }
        }

        if (!found) {
            // 获取下一页链接
            const nextPageLink = document.querySelector('.previous-comment-page');
            if (nextPageLink) {
                // 保存搜索关键词到 sessionStorage
                sessionStorage.setItem('searchUsername', username);
                sessionStorage.setItem('autoSearch', 'true');
                // 直接点击下一页，不再询问用户
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

    // 将元素添加到页面
    container.appendChild(search);
    container.appendChild(searchBtn);
    document.body.appendChild(container);

    // 检查是否需要自动搜索
    checkAutoSearch();
})(); 