// pagesIndex/literature/literature.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    literatures: [
      { 
        title: 'Measuring Breath Acetone for Monitoring Fat Loss', 
        author: 'Joseph C. Anderson', 
        time: '2015', 
        platform: 'Obesity' 
      }, {
        title: 'Basal Metabolic Rates in Mammals: Taxonomic Differences in the Allometry of BMR and Body Mass',
        author: 'Virginia Hayssen，Robert C Lacy',
        time: '1985',
        platform: 'Comparative Biochemistry and Physiology Part A Physiology'
      }, {
        title: 'Tassopoulos CN, Barnett D, Fraser TR. Breath-acetone and blood-sugar measurements in diabetes. Lancet 1969;1:1282-1286.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Kundu SK, Bruzek JA, Nair R, Judilla AM. Breath acetone analyzer: diagnostic tool to monitor dietary fat loss. Clin Chem 1993;39:87-92.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Jones AW. Measuring and reporting the concentration of acetaldehyde in human breath. Alcohol Alcohol 1995;30:271-285.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Musa-Veloso K, Likhodii SS, Cunnane SC. Breath acetone is a reliable indicator of ketosis in adults consuming ketogenic meals. Am J Clin Nutr 2002;76:65-70.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Qiao Y, Gao Z, Liu Y, et al. Breath ketone testing: a new biomarker for diagnosis and therapeutic monitoring of diabetic ketosis. Biomed Res Int 2014;2014:5.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Crofford OB, Mallard RE, Winton RE, Rogers NL, Jackson JC, Keller U. Acetone in breath and blood. Trans Am Clin Climatol Assoc 1977;88:128-139.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Triffoni-Melo AT, Dick-de-Paula I, Portari GV, Jordao AA, Garcia Chiarello P,Diez-Garcia RW. Short-term carbohydrate-restricted diet for weight loss in severely obese women. Obes Surg 2011;21:1194-1202.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Toyooka T, Hiyama S, Yamada Y. A prototype portable breath acetone analyzer for  monitoring fat loss. J Breath Res 2013;7:036005.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Spanel P, Dryahina K, Rejskova A, Chippendale TW, Smith D. Breath acetone concentration: biological variability and the influence of diet. Physiol Meas 2011;32:N23-N31.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Smith D, Spanel P, Davies S. Trace gases in breath of healthy volunteers when fasting and after a protein-calorie meal: a preliminary study. J Appl Physiol 1999; 87:1584-1588.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'St-Onge MP. The role of sleep duration in the regulation of energy balance: effects on energy intakes and expenditure. J Clin Sleep Med Off Publ Am Acad Sleep Med 2013;9:73-80.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'O’Hara WJ, Allen C, Shephard RJ, Allen G. Fat loss in the cold—a controlled study. J Appl Physiol Respir Environ Exerc Physiol 1979;46:872-877.',
        author: '',
        time: '',
        platform: ''
      }, {
        title: 'Effect of muscle mass decrease on age-related BMR changes',
        author: 'S.P. Tzankoff，A.H. Norris',
        time: '1977',
        platform: 'NCBI'
      }, {
        title: 'is BMR repeatable in deer mice? Organ mass correlates and the effects of cold acclimation and natal altitude',
        author: 'G. A. Russell， M. A. Chappell',
        time: '2007',
        platform: 'Springer'
      }, {
        title: 'An analysis of the factors that influence the level and scaling of mammalian BMR',
        author: 'Brian Keith McNab',
        time: '2008',
        platform: 'Comparative Biochemistry and Physiology'
      }
    ],
    showList:[],
    allTip:false
  },

  changeTip(){
    this.setData({
      allTip: !this.data.allTip
    })
  },
  onLoad(){
    let showList = this.data.literatures.map((item)=>{
      console.log(item)
      return this.showText(item);
    });
    this.setData({
      showList
    })
  },
  showText(item){
    let arr = ['title', 'author', 'time','platform'];
    let txt ='';
    for (let key of arr){
      if (item[key]){
        txt += item[key]+';'
      }
    }
    return txt;
  }
})