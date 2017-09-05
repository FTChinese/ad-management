# ad-management
一个综合的广告模板管理、展示工具。

## 一、目录划分简单介绍
### 1. 模板部分：templates、complex_pages
#### templates: 开发、构建模板。

其中构建模板有两种模式：（1）生产模式（构建线上传漾系统中实际应用的模板）；（2）展示模式（用于构建销售部给客户展示Demo中用到的模板）两种模式。

#### complex_pages: 复杂模板通过iframe将引入的h5页面
与线上dev_www\frontend\tpl\marketing\complex_pages目录内容(线上路径为 <http://www.ftchinese.com/m/marketing/complex_pages/pushdownPic.html> )保持一致，是一些复杂h5页面，用于被相应模板通过iframe调用。

这里需要说明的是，有些模板自身很简单，不需要再调用外部复杂页面，如imgAd、mobileFullScreenImage；有些模板较复杂，需要在模板中用iframe引用complex_pages目录下的h5页面（或广告商直接提供的h5页面），如html5Ad、pushdownPic、pushdownVideo。

**注意：** h5页面本身请尽量不要直接在complex_pages下修改，它们都是由各自项目编译、压缩生成的。例如，complex_pages/pushdownPic.html是由<https://github.com/FTChinese/ad-pushdownPic> 项目生成， complex_pages/pushdownVideo是由<https://github.com/FTChinese/ad-pushdownVideo> 项目生成。

### 2. 展示部分：views、data、client
用于构建销售部给客户展示Demo的相关页面。

## 二、使用方法（以pushdownPic.html模板为例）

### 1. 广告模板管理人员使用办法：
#### (1) 修改广告模板主体部分
templates/dev下存储广告模板主体部分，即不包括传漾变量设置部分、imp追踪部分。为了方便引入变量设置部分和imp追踪部分，每个html都含有：
```
{{defineVar.pushdownPic}}
...
{{defineSendImpfunc}}
```
其中，defineSendImpfunc为压缩处理后的sendImpToThridParty函数内容，详见后；defineVar.pushdownPic为pushdownPic.html模板的变量设置部分，详见后。

具体步骤为：

- 进入templates/dev，打开pushdownPic.html
- 如为新建模板，则记得在恰当位置写下{{defineVar.pushdownPic}}和{{defineSendImpfunc}}

#### （2）修改广告模板变量设置部分
templates/data下存储广告模板所需的数据。具有forProd和forShow两种版本的数据，其中forProd存储生产模式数据；forShow存储展示模式数据。作为广告模板管理人员，只需注意templates/data/forProd下的文件即可。

而在templates/data/forProd的文件中，分为两类：一类是广告模板变量设置文件，即以var_开头的js文件；一类为需要使用的函数，即以func_开头的js文件。在这一步，只需关注第一类文件即可。

具体步骤为：

- 进入templates/data/forProd,打开var_pushDownPic.js
- 修改或新增各个变量，包括"[[]]"形式的变量，用于传漾系统模板替换
- 如需进行imp追踪统计，在合适位置添加：

```
  if (typeof window.parent.sendImpToThirdParty === 'function') {
      window.parent.sendImpToThirdParty(Imp, AdName, AssID);
  } else {
      sendImpToThirdParty(Imp, AdName, AssID);
  }
```
#### (3)修改imp广告追踪函数
templates/forProd/func_sendImpToThirdParty.js存储sendImpToThirdParty函数。如需修改，请在这里修改。

具体步骤为：

- 打开templates/forProd/func_sendImpToThirdParty.js，进行修改。

#### （4）编译生成最终线上可使用模板
具体步骤为：

- 执行 gulp template:forProd
- 得到templates/forProd/pushdownPic.html，即为最终模板，传到传漾系统即可

### 2. 广告呈现管理人员使用办法：
#### （1）生成展示模式的模板
- 修改templates/data/forShow/var_pushDownPic.js
- 执行 gulp template: forShow

####  (2) 修改呈现页面相关文件
- 修改views、data、client