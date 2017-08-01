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
const envForView = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(['views','views/showpages','views/includeTemplates'],{
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
/******* For templates: Start *********/
gulp.task('forShow',(done) => {
  Promise.resolve(process.env.MYENV = 'show');
  done();
});

gulp.task('funcForProd', (done) => {
  pump([
    gulp.src('client/js/func_sendImpToThirdParty.js'),
    $.uglify(),
    gulp.dest('templates/func')
  ],done);
});
gulp.task('dataForProd', async () => {
   const funcString = await fs.readAsync('templates/func/func_sendImpToThirdParty.js','utf8');
   const dataForDev = {
     defineSendImpfunc: funcString
   }
   fs.writeAsync('templates/data/forProd.json',dataForDev);
});
gulp.task('forProd',gulp.series('funcForProd','dataForProd', () => {
  return Promise.resolve(process.env.MYENV = 'prod');// Promise.resolve返回一个resovle后的promise对象
}));


gulp.task('template', async () => {
  console.log(process.env.MYENV);
  let dataForRender;
  let destDir;
  if (process.env.MYENV === 'prod') {
    console.log(process.env.MYENV);
    dataForRender = await fs.readAsync('templates/data/forProd.json', 'json');
    destDir = 'templates/forProd';
  } else {
    dataForRender = await fs.readAsync('templates/data/forShow.json', 'json');
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
gulp.task('del:prodTemplate', (done) => {
 del(['templates/forProd']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});
gulp.task('del:showTemplate', (done) => {
 del(['templates/forShow']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});
gulp.task('template:forProd', gulp.series('del:prodTemplate','forProd','template'));
gulp.task('template:forShow', gulp.series('del:showTemplate','forShow','template'));
/***** For templates: End ********/


/***** For Show At Local: start ******/
gulp.task('copy:includeTemplate', () => {
  const srcPath = 'templates/forShow/';
  return gulp.src(`${srcPath}inReadAd.html`)
    .pipe(gulp.dest('views/includeTemplates'));
});
gulp.task('html', gulp.series('copy:includeTemplate', async function() {
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
        if(baseName === 'index') {
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
}));



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
       rollupUglify({}, minifyEs6)
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

gulp.task('copysource', () => {
  const complexpagesDir = '.tmp/complex_pages';
  const templatesDir = '.tmp/templates';

  const complexpagesStream = gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('templates/forShow/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(complexpagesStream,templatesStream);
});
gulp.task('serve',gulp.series('template:forShow','copysource','html','style','script',function() {
  browserSync.init({
    server:{
      baseDir: ['.tmp'],
      //directory:true,
      routes: {
        '/bower_components':'bower_components',
        '/node_modules':'node_modules'
      }
    },
    port:8080//一定要和“创建凭据”的“已获授权的 JavaScript 来源”设置的端口一致
  });
  gulp.watch('client/styles/**/*.scss',gulp.parallel('style'));
  gulp.watch('client/js/**/*.js',gulp.parallel('script'));
  gulp.watch(['views/*.html','views/**/*.html','data/*.json'],gulp.parallel('html'));
  gulp.watch(['views/templates/*.html','complex_pages/*.html'],gulp.parallel('copysource'));
}));
/***** For Show at Local: End ******/


/****** For Publish the Show Online: Start ********/
gulp.task('del', (done) => {
 del(['.tmp','dist','deploy']).then( paths => {
    console.log('Deleted files:\n',paths.join('\n'));
    done();
  });
});

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

gulp.task('build:copysource', () => {
  const complexpagesDir = 'dist/complex_pages';
  const templatesDir = 'dist/templates';

  const complexpagesStream = gulp.src('complex_pages/**.html')
    .pipe(gulp.dest(complexpagesDir));
  const templatesStream = gulp.src('views/templates/**.html')
    .pipe(gulp.dest(templatesDir));
  return merge(complexpagesStream,templatesStream);
});

gulp.task('publish', gulp.series('del','html','style','script','build:pages','build:copysource',()=>{
  const pagesDir = '../dev_cms/ad-management';
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



// TODO:通过views/templates下的展示版模板，生成最终模板
gulp.task('prodtemplate', async() => {
  
   let funcForRender = await fs.readAsync('./client/js/func_sendImpToThirdParty.js');
   
   const dataForRender = await fs.readAsync('./data-prod/imgAd-prod.json', 'json');
   const renderFile = "imgAd.html"
   const renderResult = await render(renderFile, dataForRender);
   await fs.writeAsync('./templates/imgAd.html', renderResult);
   return;
});

