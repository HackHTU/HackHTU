import './mui.min'
//执行test.js，但不导入任何变量
document.addEventListener('plusready', function() {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function() {
            webview.canBack(function(e) {
                if(e.canBack) {
                    webview.back();             
                } else {
                    //webview.close(); //hide,quit
                    //plus.runtime.quit();
                    mui.plusReady(function() {
                        //首页返回键处理
                        //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                        var first = null;
                        plus.key.addEventListener('backbutton', function() {
                            //首次按键，提示‘再按一次退出应用’
                            if (!first) {
                                first = new Date().getTime();
                                mui.toast('再按一次退出应用');
                                setTimeout(function() {
                                    first = null;
                                }, 1000);
                            } else {
                                if (new Date().getTime() - first < 1500) {
                                    plus.runtime.quit();
                                }
                            }
                        }, false);
                    });
                }
            })
        });
    });
 
//不需要mui.js版本
document.addEventListener('plusready', function() {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function() {
            webview.canBack(function(e) {
                if(e.canBack) {
                    webview.back();             
                } else {
                    //webview.close(); //hide,quit
                    //plus.runtime.quit();
                    //首页返回键处理
                    //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                    var first = null;
                    plus.key.addEventListener('backbutton', function() {
                        //首次按键，提示‘再按一次退出应用’
                        if (!first) {
                            first = new Date().getTime();
                            console.log('再按一次退出应用');
                            setTimeout(function() {
                                first = null;
                            }, 1000);
                        } else {
                            if (new Date().getTime() - first < 1500) {
                                plus.runtime.quit();
                            }
                        }
                    }, false);
                }
            })
        });
    });