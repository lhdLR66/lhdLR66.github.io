// 修复补丁：只添加城市选择功能，不破坏原有内容
(function() {
    console.log('=== 应用修复补丁 ===');
    
    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFix);
    } else {
        applyFix();
    }
    
    function applyFix() {
        console.log('应用修复...');
        
        // 1. 确保productData存在
        if (typeof window.productData === 'undefined') {
            console.error('productData未定义！');
            return;
        }
        
        // 2. 确保regionDetailedData存在
        if (!window.regionDetailedData || !window.regionDetailedData.regions) {
            console.error('regionDetailedData未加载！');
            return;
        }
        
        // 3. 修复区域按钮 - 确保所有省份都有
        const regionTabs = document.getElementById('regionTabs');
        if (regionTabs) {
            console.log('检查区域按钮...');
            
            // 获取所有应该有的区域
            const allRegions = Object.keys(window.regionDetailedData.regions);
            const municipalities = ['北京', '上海', '天津', '重庆'];
            const existingButtons = Array.from(regionTabs.querySelectorAll('.region-tab'))
                .map(btn => btn.dataset.region);
            
            // 添加缺失的省份
            allRegions.forEach(region => {
                if (region !== '全国' && !existingButtons.includes(region)) {
                    const btn = document.createElement('button');
                    btn.className = 'region-tab';
                    btn.dataset.region = region;
                    btn.textContent = region;
                    
                    // 复制点击事件逻辑
                    btn.onclick = function() {
                        // 找到现有的点击事件处理函数
                        const existingHandler = regionTabs.querySelector('.region-tab').onclick;
                        if (existingHandler) {
                            existingHandler.call(this);
                        }
                    };
                    
                    regionTabs.appendChild(btn);
                    console.log('添加省份按钮:', region);
                }
            });
        }
        
        // 4. 确保图表初始化
        setTimeout(() => {
            if (typeof window.updateChartsForRegion === 'function') {
                console.log('图表函数存在，尝试初始化...');
                // 如果当前没有选中区域，默认显示全国
                const currentRegion = document.querySelector('.region-tab.active')?.dataset.region || '全国';
                window.updateChartsForRegion(currentRegion);
            } else {
                console.warn('updateChartsForRegion函数未找到');
            }
        }, 1000);
        
        console.log('修复补丁应用完成');
    }
})();