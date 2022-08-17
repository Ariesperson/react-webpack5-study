const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式
module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  module: {
    //由于webpack默认只能识别js文件,不能识别jsx语法,需要配置loader的预设预设 @babel/preset-typescript 来先ts语法转换为 js 语法,再借助预设 @babel/preset-react 来识别jsx语法。
    rules: [
      {
        include: [path.resolve(__dirname, '../src')], //只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: 'babel-loader'
        // 由于thread-loader不支持抽离css插件MiniCssExtractPlugin.loader(下面会讲),所以这里只配置了多进程解析js,
        // 开启多线程也是需要启动时间,大约600ms左右,所以适合规模比较大的项目。
        // use: ['thread-loader','babel-loader']
      },
    // 因为webpack默认只认识js,是不识别css文件的,需要使用loader来解析css
    // style-loader: 把解析后的css代码从js中抽离,放到头部的style标签中(在运行时做的)
    // css-loader: 解析css文件代码
    // 拆分配置的less和css, 避免让less-loader再去解析css文件
        {
            test: /.css$/, //匹配所有的 css 文件
            include: [path.resolve(__dirname, '../src')],
            use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
            'css-loader',
            'postcss-loader'
            ]
        },
        {
            test: /.less$/, //匹配所有的 less 文件
            include: [path.resolve(__dirname, '../src')],
            use: [
             isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
            'css-loader',
            'postcss-loader',
            'less-loader'
            ]
        },
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/images/[name].[contenthash:8].[ext]', // 文件输出目录和命名
        },
      },
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/fonts/[name].[contenthash:8].[ext]', // 文件输出目录和命名
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        // ...
        generator:{ 
          filename:'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
    ]
  },
    // extensions是webpack的resolve解析配置下的选项，在引入模块时不带文件后缀时，
    // 会来该配置数组里面依次添加后缀查找文件，因为ts不支持引入以 .ts, tsx为后缀的文件，所以要在extensions中配置，而第三方库里面很多引入js文件没有带后缀，
    // 所以也要配置下js
    // 这里只配置js, tsx和ts，其他文件引入都要求带后缀，可以提升构建速度。
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    // 设置别名可以让后续引用的地方减少路径的复杂度。
    alias: {
        '@': path.join(__dirname, '../src')
    },
    modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  //webpack需要把最终构建好的静态资源都引入到一个html文件中,这样才能在浏览器中运行,html-webpack-plugin就是来做这件事情的,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
        'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    }),
    new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'), // 复制public下文件
            to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
            filter: source => {
              return !source.includes('index.html') // 忽略index.html
            }
          },
        ],
    }),
  ],
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)