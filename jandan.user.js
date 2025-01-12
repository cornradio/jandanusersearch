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

    // 在函数外部添加一个变量来跟踪当前找到的索引
    let currentFoundIndex = -1;
    // 在函数外部添加一个变量来标记是否已经到达当前页面的最后一个匹配项
    let isLastMatchInPage = false;

    // 搜索功能
    async function searchUsername() {
        const username = search.value.trim();
        if (!username) return;

        const authors = Array.from(document.querySelectorAll('.author'));
        
        // 清除所有高亮
        document.querySelectorAll('.highlight-author').forEach(el => {
            el.classList.remove('highlight-author');
        });

        // 找出所有匹配的作者
        const matchedAuthors = authors.filter(author => 
            author.textContent.includes(username)
        );

        if (matchedAuthors.length > 0) {
            // 如果已经是最后一个且再次点击，则跳转到下一页
            if (isLastMatchInPage) {
                const nextPageLink = document.querySelector('.previous-comment-page');
                if (nextPageLink) {
                    sessionStorage.setItem('searchUsername', username);
                    sessionStorage.setItem('autoSearch', 'true');
                    nextPageLink.click();
                    return;
                }
            }

            // 增加当前索引
            currentFoundIndex = (currentFoundIndex + 1) % matchedAuthors.length;
            const currentAuthor = matchedAuthors[currentFoundIndex];
            
            // 高亮并滚动到当前匹配的作者
            currentAuthor.classList.add('highlight-author');
            currentAuthor.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 更新是否到达当前页面最后一个匹配项的标记
            isLastMatchInPage = (currentFoundIndex === matchedAuthors.length - 1);
            
        } else {
            // 当前页面没有找到匹配项，直接跳转下一页
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
            sessionStorage.removeItem('autoSearch');
            search.value = searchUsername;
            currentFoundIndex = -1; // 重置索引
            isLastMatchInPage = false; // 重置最后匹配项标记
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