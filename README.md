###一叶书签 源码参考

一叶书签是一个始于2014年年初的社交化书签分享工具。产品形式包括web、Google Chrome Extension、Android。不过现在已经成为历史了。域名http://yiye.me 由于疏忽到期被抢注，服务器数据也因服务器过期被抹除。对此我有不可推卸的责任，十分抱歉。感谢[@koi646](https://github.com/koi646)、[@zweipix](https://github.com/zweipix)、[@coolbit-in](https://github.com/coolbit-in)、[@vinthony](https://github.com/vinthony)、[@axlecho](https://github.com/axlecho)曾经一起熬夜写代码。存放在GitHub私有仓库的代码一度因为付费账户过期被锁定。好在今天终于把他公开出来。

在开发一叶书签的初期，我当时正痴迷于Node.js技术，因此采用了[MEAN](https://github.com/linnovate/mean)（MongoDB+Express+AngularJS+Node.js）架构作为开发框架。开发过程中发现AngularJS过于繁琐和约束，便改用更加轻量的Backbone.js作为前端MVC框架。或许现在看来，这些框架都已经有些过时了，那时却让我充满了新鲜和探索。

Node.js是一个充满魅力的开发平台，至少对我来说。健康活跃的社区、现代化的第三方包管理机制、熟悉和擅长的语言风格、清晰易懂的文档说明、无所不能的功能以及据说很不错的服务器性能。这一切都是我所期待的开发环境。在后期的开发过程中，Node.js的回调式编程风格和异步编程思路有时却让一些很简单的问题变得异常繁琐。此外，Node.js的单线程模式伴随着异步下错误的难以捕获，也让程序的健壮性受到严重考验。用通俗易懂的语言描述就是，服务器很可能会因为代码中一个很小的错误，例如某个用户的一个不规范提交，就导致整个服务器崩溃挂掉。而回调式的编程方式在控制程序流程的过程中有时很容易产生一些小问题（关于这点，也可以说是我们编程能力还太弱。），同时发现和捕获错误也异常困难。好在我们通过各种努力尽可能解决了这些问题，服务器很少会挂掉，但是写代码却变得必须谨小慎微且繁琐无趣了。现在想来仍然心有余悸。这可以说是我当时没有继续下去这个项目的一个原因吧？

后来我重新研究和审视了很多其他语言和平台，Python、PHP、Ruby等等，都或多或少存在各自的优缺点，并不存在绝对适合和完美的技术。现在看来，Node.js反而正在向着更好的方向发展，ECMAScript 6的成熟和普及，带来了更加完善的JavaScript语言标准以及更加强大多样的功能模块。异步回调问题也有了很多差强人意的解决办法。Node.js从v4.0开始也变得更加开放和高效了。最近我也又开始重新使用和喜欢它。

我以前喜欢一种技术，就会疯狂的热爱。最开始用PHP，就真觉得PHP是世界上最好的语言。后来写JavaScript，就觉得JavaScript无所不能。当开始写Node.js的时候，又觉得PHP是如此的low，从此不再使用PHP。整日里张口闭口都是Node.js，在各种社交网络里和朋友面前乐此不疲的推荐。后来当真正被Node.js一些糟糕设计所困的时候，从而又很长时间没有再碰过Node.js。当时内心充满了失望。正所谓，都多爱就会有多恨吧。

在我放弃Node.js的日子里，我又重新用过PHP。PHP有很多的设计缺点，或者说有段时间没有跟上时代的步伐。这也是我曾将认为它low的原因。当然，PHP这几年也在快速革新。PHP最大的优点，莫过于如果你想要开发任何类型的网站，搜一搜源码，总能找到类似功能的PHP源码。可见其群众基础之广。去找一个PHP源代码程序改巴改巴快速把产品上线。和用一个所谓高端的语言，配合了敏捷开发，组件化，工程自动化，团队管理工具等等各种技术去从0开发一个产品。很难简单的确定哪种方式在特定的环境下是更优的选择。

所以呢，技术和语言是很难区分高下的。而只有谁更适合。最近经常反思自己，在技术上有时过于激进和盲从。

技术人员有几大偏执的热爱，孜孜不倦的造轮子、接手新项目必须推倒重构、热衷于追求最新高端的开发技术、面红耳赤的争论哪种语言更牛逼。

以前在学校开发一叶书签的时候，总觉得自己的产品技术栈牛逼爆了。拿着一叶书签去参加学校的一些比赛。其他团队最后的展示PPT都着重介绍自己产品的功能和前景。我总是先用大段的时间介绍一叶书签用了自认为多么牛逼的技术架构。想着整个学校可能只有我用如此厉害到你们可能都没听过的技术开发产品。内心感觉自己是如此的牛逼，就像一个地下摇滚乐队，嘶吼着向台下伸出六个是指头，Rock You！！！

现在想来当时除了自己，Who care 你在使用什么技术。一叶书签开发了很久，结果其实并没有几个用户，一方面是整个团队都在做开发，没有考虑运营和推广。另一方面产品和技术上依然存在很多缺陷，并没有对用户产生多强的使用需求。最后在没有产出多少的产品价值的情况下戛然而止。反观我一个网友，四线城市个人站长，一个免费网站源码加上一年几百块钱的某个技术接口服务费。网站日ip保持在50w左右。高峰时期甚至日ip达到200w，pv达到2000w。

纯粹的技术钻研永远是技术人员追求的最高精神境界。可是，无论是技术还是产品。当无人问津的时候，难免还是有些落寞。好在，机会永远是存在的。

一叶书签的源码现在也有些像一座年久的烂尾楼。我也不知道它有多大的开源价值。

Express曾经无疑是Node.js生态圈中最为著名而没有之一的web开发框架。不过作者也放弃转而去创造一定程度缓解回调的Koajs了。然而Koajs一直没有成为下一个Express。现在的局面是，Express由于在回调和可维护上的问题以及作者的放弃，处于半死不活的状态。Koajs一方面无法形成也无法迁移Express曾经众多的第三方模块。另一方面，Koajs的架构也一直处于不稳定的变化中，从Co+thunkify到Co+Promise，再到正在测试的Async/await，很难让人放心的去立即使用。使用了Express的一叶书签现在的参考价值会比较尴尬。

JavaScript生态圈就像曾经快速发展的中国一样，快速的从一片贫瘠迈向繁荣发达。在此过程中，任何新鲜的思想和创造都会被快速的普及并且不久即被淘汰，因为总是有有更加先进且发达的事物出现。一两年前一叶书签的一些看起来还挺先进的技术栈。例如Express，Grunt，Backbone.js，node.js v0.10版本，现在都已经门可罗雀了。此外项目里引用的大量第三方包也因为兼容性问题或者其他原因可能会安装失败或出错。

当然里面的代码还是会有一些值得参考的地方。比如mongoose的使用，一些前端样式。或者看看commit记录，看看曾经因为git技能不过关，闹出过哪些笑话，博君一笑。

最后，简单介绍下整个项目的结构，方面不怕麻烦的朋友翻看代码。

`config` 目录主要存放配置文件和工具。其子目录 `env` 分别放置了共用，开发模式下，产品模式下，测试模式下的配置文件。配置选项包括，数据库连接、第三方登录接口以及七牛静态文件配置等。子目录 `tool` 下面则放置了一些工具文件。

`server.js`则是主运行文件。

`packages`目录则是主要的代码存放目录，下面存放了网站全部的功能模块。每个模块对应一个子目录，这样更有利代码的组织维护。在模块目录下，有两个子目录：`server` 和 `public` ，即对应模块的前后端文件目录。`server` 目录下面包括了服务器端对应的MVC目录结构。`public`目录下面原本也有对应的前端MVC结构，后来被我简化到只有静态文件存放目录 `assets`，这个目录下面则分别存放js、css、和图片文件。

大致的目录结构便是如此，如仍有其他问题可以联系我讨论，或者issue也行，不胜荣幸。邮箱：hehe1949@Gmail.com。

前述某些观点可能会引起口水战。所以先表态下：我所说的都不一定正确。







