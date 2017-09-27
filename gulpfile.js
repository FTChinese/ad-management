const path = require('path');
const nunjucks = require('nunjucks');
const gulp = require('gulp');
const fs = require('fs-jetpack');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollupUglify = require('rollup-plugin-uglify');
const minifyEs6 = require('uglify-es').minify;
const del = require('del');
const merge = require('merge-stream');
const pump = require('pump');
process.env.MYENV = 'show';
var cache;

/*****定义两个全局变量，用于存储渲染模板使用的数据*****/
var dataForProd;//存储用于渲染生产模式模板的数据对象
var dataForShow;//存储用于渲染展示模式模板的数据对象


/**********Nunjucks渲染环境配置：start*********/
/**
 * 两种渲染环境：
 * 1. 展示渲染环境：渲染的是展示文件，被渲染文件在views目录下。
 * 2. 模板渲染环境：渲染的是模板开发文件，被渲染文件在templates/dev目录下。
 */
const envForView = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(['views','views/showpages','templates/forShow'],{
    watch:false,//MARK:如果为true，则会导致html任务挂在那儿
    noCache:true
  }),
  {
    autoescape:false
  }
);

function renderForView(template, context) {
  return new Promise(function(resolve, reject) {
      envForView.render(template,context,function(err,res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
}

const envForTemplate = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(['templates/dev'],{
    watch:false,//MARK:如果为true，则会导致html任务挂在那儿
    noCache:true
  }),
  {
    autoescape:false
  }
);

function renderForTemplate(template, context) {
  return new Promise(function(resolve, reject) {
      envForTemplate.render(template,context,function(err,res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
}
/**********Nunjucks渲染环境配置：End*********/


/******* For templates: Start *********/
/**
 * 任务'dataForProd':
 * @purpose:生成展示模式模板所需Object数据。
 * @description:将templates/data/forShow下的相关js文件内容读取整合至全局变量dataForShow
 */
gulp.task('dataForShow', async () => {
  const jsSourcePath = 'templates/data/forShow/';
  const defineSendImpfunc = await fs.readAsync(`${jsSourcePath}compressedFunc/func_sendImpToThirdParty.js`,'utf8');
  const ccVideo = await fs.readAsync(`${jsSourcePath}var_ccVideo.js`,'utf8');
  const fullWidthTopBanner = await fs.readAsync(`${jsSourcePath}var_fullWidthTopBanner.js`,'utf8');
  const html5Ad = await fs.readAsync(`${jsSourcePath}var_html5Ad.js`,'utf8');
  const imgAd = await fs.readAsync(`${jsSourcePath}var_imgAd.js`,'utf8');
  const inReadAd = await fs.readAsync(`${jsSourcePath}var_inReadAd.js`,'utf8');
  const mobileFullScreenImage = await fs.readAsync(`${jsSourcePath}var_mobileFullScreenImage.js`,'utf8');
  const mobileInfoFlow = await fs.readAsync(`${jsSourcePath}var_mobileInfoFlow.js`,'utf8');
  const pushDownVideo = await fs.readAsync(`${jsSourcePath}var_pushDownVideo.js`,'utf8');
  const pushDownPic = await fs.readAsync(`${jsSourcePath}var_pushDownPic.js`,'utf8');
  dataForShow = {
     defineSendImpfunc,
     defineVar:{
       ccVideo,
       fullWidthTopBanner,
       html5Ad,
       imgAd,
       inReadAd,
       mobileFullScreenImage,
       mobileInfoFlow,
       pushDownVideo,
       pushDownPic
     }
   }
   //fs.writeAsync('templates/data/forProd/forProd.json',dataForDev);
});

/**
 * 任务'forShow'：
 *  @Purpose:标记模板用于展示模式。主要就是设置process对象的属性为'show'。
 */
gulp.task('forShow',(done) => {
  Promise.resolve(process.env.MYENV = 'show');
  done();
});

/**
 * 任务'compressFunc'：
 * @purpose:将开发环境下的函数sendImpToThirdParty从开发目录client下压缩、复制到templates目录下。该函数用于广告第三方数据追踪，如需修改，请在client/js/func_sendImpToThirdParty.js文件中完成。
 */
gulp.task('compressFunc', (done) => {
  
  pump([
    gulp.src('../NEXT/app/scripts/ad-third-party-impression.js'),
    $.uglify(),
    gulp.dest('templates/data/forProd/compressedFunc')
  ],done);
});

/**
 * 任务'dataForProd':
 * @purpose:生成生产环境模板所需Object数据。
 * @description:将templates/data/forProd下的相关js文件内容读取整合至全局变量dataForProd
 */
gulp.task('dataForProd', async () => {
  const jsSourcePath = 'templates/data/forProd/';
  const defineSendImpfunc = await fs.readAsync(`${jsSourcePath}compressedFunc/ad-third-party-impression.js`,'utf8');
  const ccVideo = await fs.readAsync(`${jsSourcePath}var_ccVideo.js`,'utf8');
  const fullWidthTopBanner = await fs.readAsync(`${jsSourcePath}var_fullWidthTopBanner.js`,'utf8');
  const html5Ad = await fs.readAsync(`${jsSourcePath}var_html5Ad.js`,'utf8');
  const imgAd = await fs.readAsync(`${jsSourcePath}var_imgAd.js`,'utf8');
  const inReadAd = await fs.readAsync(`${jsSourcePath}var_inReadAd.js`,'utf8');
  const mobileFullScreenImage = await fs.readAsync(`${jsSourcePath}var_mobileFullScreenImage.js`,'utf8');
  const mobileInfoFlow = await fs.readAsync(`${jsSourcePath}var_mobileInfoFlow.js`,'utf8');
  const pushDownVideo = await fs.readAsync(`${jsSourcePath}var_pushDownVideo.js`,'utf8');
  const pushDownPic = await fs.readAsync(`${jsSourcePath}var_pushDownPic.js`,'utf8');
  
  dataForProd = {
     defineSendImpfunc,
     defineVar:{
       ccVideo,
       fullWidthTopBanner,
       html5Ad,
       imgAd,
       inReadAd,
       mobileFullScreenImage,
       mobileInfoFlow,
       pushDownVideo,
       pushDownPic
     }
   }
   //fs.writeAsync('templates/data/forProd/forProd.json',dataForDev);
});

/**
 * 任务：'forProd'
 *  @Purpose:标记模板用于生产模式。主要就是设置process对象的属性为'prod'。
 */
gulp.task('forProd',gulp.series(() => {

  return Promise.resolve(process.env.MYENV = 'prod');// Promise.resolve返回一个resovle后的promise对象
}));

/**
 * 任务'template":
 * @purpose:使用两种模式的数据渲染开发模板以得到两种模式下的广告模板文件。
 * @description:广告模板有两种模式：
 *    （1）当为生产模式时，使用templates/data/forProd.json渲染，生成的文件放在temlates/forProd目录下；
 *     （2）当为展示模式时，使用templates/data/forShow.json渲染，生成的文件放在tempaltes/forShow目录下。
 */
gulp.task('template', async () => {
 
  console.log(process.env.MYENV);
  let dataForRender;
  let destDir;
  if (process.env.MYENV === 'prod') {
    console.log(process.env.MYENV);
    //dataForRender = await fs.readAsync('templates/data/forProd.json', 'json');
    dataForRender = dataForProd;
    destDir = 'templates/forProd';
  } else {
    //dataForRender = await fs.readAsync('templates/data/forShow.json', 'json');
    dataForRender = dataForShow;
    destDir = 'templates/forShow';
  }
  let templateFileArr = fs.find('templates/dev', {
    matching:'*.html'
  });
  console.log(templateFileArr);
  templateFileArr = templateFileArr.map((item) => {
    return path.basename(item);
  });
  function renderOneTemplate(oneTemplate) {
    return new Promise(
      async function(resolve, reject) {
        const renderResult = await renderForTemplate(oneTemplate, dataForRender);
        const baseName = path.basename(oneTemplate, '.html');
        const renderFile = `${baseName}.html`;
        const destFile = path.resolve(destDir, renderFile);
        const result = {
          renderResult,
          destFile
        };
        resolve(result)
      }
    ).then(result => {
      fs.writeAsync(result.destFile, result.renderResult);
    }).catch(error => {

    })
    
  }

  function renderTemplates(templateFileArr) {
    return templateFileArr.map((item) => { //返回一个Promise数组
      return renderOneTemplate(item);
    });
  }

  return Promise.all(renderTemplates(templateFileArr))
    .then(() => {
      browserSync.reload();
    })
    .catch(error => {
      console.log(error);
    });
  }
)

/**
 * 任务'del:prodTemplate'：
 * @purpose: 删除已构建的生产模式的广告模板。
 * @description: 删除templates/forProd目录下html文件
 */
gulp.task('del:prodTemplate', (done) => {
  
 del(['templates/forProd/*.html']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});

/** 
 * 任务'del:showTemplate'：
 * @purpose: 删除已构建的展示模式的广告模板。
 * @description: 删除templates/forShow目录下html文件
 */
gulp.task('del:showTemplate', (done) => {
 del(['templates/forShow/*.html']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});

/**
 * 任务'template:forProd':
 * @purpose: 构建生产模式的广告模板。
 * @description: 依次执行任务'del:prodTemplate','forProd','template'
 */
gulp.task('template:forProd', gulp.series('del:prodTemplate','compressFunc','dataForProd','forProd','template'));

/**任务'template:forShow':
 * @purpose: 构建展示模式的广告模板。
 * @description: 依次执行任务'del:showTemplate','forShow','template'
 */
gulp.task('template:forShow', gulp.series('del:showTemplate','dataForShow','forShow','template'));
/***** For templates: End ********/


/***** For Show At Local: start ******/

/**
 * 任务'copy:includeTemplate':
 * @purpose: 为特殊广告形式inReadAd准备nunjucks子模板。
 * @description: 由于该广告和其他广告不同，该广告不是以iframe调用dolphine的方式展现，而是以嵌入的html片段的形式直接呈现。故需要将该片段从templates/forShow/inReadAd.html拷贝到views/includeTemplates/inReadAd.html
 */

 /*
gulp.task('copy:includeTemplate', () => {
  const srcPath = 'templates/forShow/';
  return gulp.src(`${srcPath}inReadAd.html`)
    .pipe(gulp.dest('views/includeTemplates'));
});
*/

/**
 * 任务 'html'：
 * @purpose:Nunjucks渲染展示页面
 * @description:使用data目录下的展示页面json文件的数据分别渲染主页面html(views目录下的index.html)和各个广告展示页面html(views/showpages下的html),得到渲染后的页面拷贝到.tmp目录的根目录下
 */
gulp.task('html', async function() {
  const destDir = '.tmp';
  const dataFileArr = fs.find('data',{
    matching:'*.json',
    files:true,
    directories:false,
    recursive:false
  });//得到data目录下所有json文件路径(包含'data'这一层)
  function renderOneView(item) {
    return new Promise (
      async function(resolve, reject) {
        const dataForRender = await fs.readAsync(item, 'json');
        const baseName = path.basename(item,'.json');
        let renderFile = '';
        if(baseName === 'index' || baseName === 'adTable') {
          renderFile = `${baseName}.html`;
        } else {
          renderFile = `show-${baseName}.html`;
        }
        const renderResult = await renderForView(renderFile, dataForRender);
        const destFile = path.resolve(destDir, renderFile);
        const result = {
          renderResult,
          destFile
        };
        resolve(result);
      }
    )
    .then(result => {
      fs.writeAsync(result.destFile, result.renderResult);
    })
    .catch(error => {

    })
  }
  function renderViews(dataFileArr) {
    return dataFileArr.map((item) => { //返回一个Promise数组
     return renderOneView(item);
    });
  }
  return Promise.all(renderViews(dataFileArr))
    .then(() => {
      browserSync.reload('*.html');
    })
    .catch(error => {
      console.log(error);
    });
});


/**
 * 任务 'script'：
 * @purpose:打包并压缩展示页面的es6代码
 * @description:将client/js下的es6代码使用rollup打包、压缩，并写入.tmp/scripts/main.js,以提供给展示页面html
 */
gulp.task('script',() => {
  // TODO:关于rollup需要再认真学习一下
   return rollup({
     entry:'client/js/main.js',
     cache: cache,
     plugins:[
       babel({//这里需要配置文件.babelrc
         exclude:'node_modules/**'
       }),
       nodeResolve({
         jsnext:true,
       }),
       rollupUglify({}, minifyEs6)//压缩es6代码
     ]
   }).then(function(bundle) {
     cache = bundle;//Cache for later use
     return bundle.write({//返回promise，以便下一步then()
       dest: '.tmp/scripts/main.js',
       format: 'iife',
       sourceMap: true,
       moduleName:'myJsModule',
     });
   }).then(() => {
     browserSync.reload();
   }).catch(err => {
     console.log(err);
   });
});

gulp.task('scriptForAdtable',() => {
  // TODO:关于rollup需要再认真学习一下
   return rollup({
     entry:'client/js/main-adtable.js',
     cache: cache,
     plugins:[
       babel({//这里需要配置文件.babelrc
         exclude:'node_modules/**'
       }),
       nodeResolve({
         jsnext:true,
       }),
       rollupUglify({}, minifyEs6)//压缩es6代码
     ]
   }).then(function(bundle) {
     cache = bundle;//Cache for later use
     return bundle.write({//返回promise，以便下一步then()
       dest: '.tmp/scripts/main-adtable.js',
       format: 'iife',
       sourceMap: true
      // moduleName:'myJsModule',
     });
   }).then(() => {
     browserSync.reload();
   }).catch(err => {
     console.log(err);
   });
});
/**
 * 任务 'style'：
 * @purpose:编译展示页面的sass代码
 * @description:将client/styles下的sass代码编译为css代码，并写入.tmp/styles/main.css,以提供给展示页面html
 */
gulp.task('style',() => {
  const destDir = '.tmp/styles';
  return gulp.src('client/styles/main.scss')
    .pipe($.changed(destDir))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      includePaths:['bower_components'],//@import的东西的查找位置
      outputStyle:'expanded',
      precision:10
    }).on('error',$.sass.logError))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream({once:true}));
});

/**
 * 任务 'copysource'：
 * @purpose:为本地服务器目录.tmp准备所需的模板资源
 * @description:将广告模板html资源(展示模式)从templates/forShow下拷贝到.tmp/templates目录下；将广告模板所引用的复杂外部HTML资源从complex_pages目录拷贝到.tmp/complex_pages目录下
 */

gulp.task('copysource', () => {
  const complexpagesDir = '.tmp/complex_pages'; //NOTE:这些h5不能直接用线上绝对路径，因为那样的话www.ftchinese.com会导致iframe引入的h5和父页面不同源；也不能直接使用本地complex_pages，在serve任务里多设置一个服务器basedir，那样的话引入的h5不能下推父页面元素————原因待查？？？
  
  //const templatesDir = '.tmp/templates';

  return gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  
  //const templatesStream = gulp.src('templates/forShow/**.html')
    //.pipe(gulp.dest(templatesDir));
 
  return merge(complexpagesStream,templatesStream);
});

/**
 * 任务 'del'：
 * @purpose:删除展示页面本地预览及发布相关文件目录及内容
 * @description：删除.tmp、dist、deploy目录，用以重新生成这些目录的内容
 */
gulp.task('del', (done) => {
 del(['.tmp','dist','deploy']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});

/**
 * 任务 'serve'：
 * @purpose:开启本地服务器，用浏览器打开广告展示页面
 * @description:依次执行任务'template:forShow','copysource','html','style','script'，服务器开启及代码更新后自动刷新
 */
gulp.task('serve',gulp.series('del','template:forShow','copysource','html','style','script','scriptForAdtable',function() {
  browserSync.init({
    server:{
      baseDir: ['.tmp','templates/forShow'],//增加'complex_pages'目录没用，因为这个目录下的文件是通过iframe引用的文件引用的，故complex_pages直接去掉，改为使用绝对线上路径。
      //directory:true,
      routes: {
        '/bower_components':'bower_components',
        '/node_modules':'node_modules'
      }
    },
    port:8080
  });
  gulp.watch('client/styles/**/*.scss',gulp.parallel('style'));
  gulp.watch('client/js/**/*.js',gulp.parallel('script','scriptForAdtable'));
  gulp.watch(['views/*.html','views/**/*.html','data/*.json'],gulp.parallel('html'));
 // gulp.watch(['views/templates/*.html','complex_pages/*.html'],gulp.parallel('copysource'));
}));

/***** For Show at Local: End ******/


/****** For Publish the Show Online: Start ********/


/**
 * 任务 'build:pages'：
 * @purpose:将.tmp下准备好的html、js、css整合、压缩，并将生成的html文件拷贝到dist目录。
 * @description：将.tmp目录下用于本地展示页面的html文件用gulp-smoosher注入js、css代码，并压缩，然后拷贝到dist目录下，为发布展示页面到正式服务器环境做准备。
 */
gulp.task('build:pages',() => {
  const destDir = 'dist';
	return gulp.src('.tmp/*.html')
		.pipe($.smoosher({
			ignoreFilesNotFound:true
		}))
    //.pipe($.useref())
		//.pipe($.if('*.js',$.uglify()))
		//.pipe($.if('*.css',$.minify()))
		.pipe($.htmlmin({
			collapseWhitespace:true,
			removeComments:true,
			//removeAttributeQuotes:false,
      minifyCSS:true,
      minifyJS:true,//对es6无效,故在rollup里面用插件实现
		}))
		.pipe($.size({
			gzip:true,
			showFiles:true,
			showTotal:true
		}))
		.pipe(gulp.dest(destDir));
});

/**
 * 任务 'build:copysource'：
 * @purpose:把广告模板等其他资源拷贝到dist目录
 * @description：把本地展示页面用到的其他资源 —— 1. 广告模板用到的复杂页面资源，即complex_pages目录下的html；2.展示模式广告模板，即views/templates下的html —— 拷贝到dist目录下，为发布展示页面到正式服务器环境做准备
 */

gulp.task('build:copysource', () => {
  const complexpagesDir = 'dist/complex_pages';
  const templatesDir = 'dist/templates';

  const complexpagesStream = gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('templates/forShow/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(complexpagesStream,templatesStream);
});

/**
 * 任务 'publish'：
 * @purpose:发布展示页面的完整任务
 * @description：依次执行任务'del','html','style','script','build:pages','build:copysource'，拷贝dist、dist/complex_pages、dist/templates下的html文件到backyard服务器指定目录下（即'../dev_cms/ad-management'目录）
 */
gulp.task('publish', gulp.series('del','template:forShow','html','style','script','scriptForAdtable','build:pages','build:copysource',()=>{
  const pagesDir = '../www3app/ad-management';
  const complexpagesDir = `${pagesDir}/complex_pages`;
  const templatesDir = `${pagesDir}/templates`;

  const pagesStream = gulp.src('dist/**.html')
    .pipe(gulp.dest(pagesDir));
  const complexpagesStream = gulp.src('dist/complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('dist/templates/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(pagesStream, complexpagesStream, templatesStream);
}));
/****** For Publish the Show Online: Start ********/


gulp.task('copyAdData', () => {
  const destDir = 'client/js/adData';
  return gulp.src(['../NEXT/app/scripts/adDevice.js','../NEXT/app/scripts/adChannel.js','../NEXT/app/scripts/adPattern.js'])
  .pipe(gulp.dest(destDir));
});


