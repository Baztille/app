/*********************************************************************************

    Baztille
        
    Copyright (C) 2015  Grégory Isabelli, Thibaut Villemont and contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
***********************************************************************************/

initBaztille.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  
  $httpProvider.interceptors.push(function($rootScope) {

    function testHttpApi(url) {
      if (!/^(f|ht)tps?:\/\//i.test(url)) {
         return false;
      }
      return url;
    }

   return {

    request: function(config) {
      if(testHttpApi(config.url)) { 
        $rootScope.$broadcast('loading:show')
      }
      return config
    },

    response: function(response) { 
      if(typeof response.data === "object") { 
        $rootScope.$broadcast('loading:hide')
      }
      return response
    }
   }
  })

// 
// ROUTES
// 
// splash
// logout
// question/questions
// question/proposed
// question/voted
// question/newquestion
// question/question/ID
// question/question/ID/arg
// question/voters/IDq
// question/votersarg/IDarg
// compte/points
// compte/pointsexplained
// app/news
// app/newread
// app/about
// app/video

  $stateProvider

  .state('splash', {
    url: "/splash",
    templateUrl: "templates/splash.html",
    controller: 'SplashCtrl',
    access: {
      requireLogin: false
    }
  })

  .state('logout', {
    url: "/logout",
    controller: 'logoutCtrl',
    access: {
      requireLogin: true
    }
  })

  .state('newpassword', {
    url: "/newpassword/:code",
    templateUrl: "templates/newpassword.html",
    controller: 'NewPasswordCtrl',
    access: {
      requireLogin: false
    }
  })

 
  .state('question', {
    url: "/question",
    abstract: true,
    templateUrl: "templates/menu.html",
    access: {
      requireLogin: false
    }
  })

  .state('question.questions', {
    url: "/questions",
    views: {
      'menuContent': {
        templateUrl: "templates/questions.html",
        controller: 'QuestionsCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('question.proposed', {
    url: "/proposed",
    views: {
      'menuContent': {
        templateUrl: "templates/proposed.html",
        controller: 'ProposedCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('question.voted', {
    url: "/voted",
    views: {
      'menuContent': {
        templateUrl: "templates/voted.html",
        controller: 'VotedCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('question.rejected', {
    url: "/rejected",
    views: {
      'menuContent': {
        templateUrl: "templates/rejected.html",
        controller: 'RejectedCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('question.newquestion', {
    url: "/newquestion",
    views: {
      'menuContent': {
        templateUrl: "templates/newquestion.html",
        controller: 'NewQuestionCtrl'
      }
    },
    access: {
      requireLogin: true
    }
  })

  .state('question.single', {
    url: "/questions/:questionID",
    views: {
      'menuContent': {
        templateUrl: "templates/question.html",
        controller: 'QuestionCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })
  
  .state('question.arg', {
    url: "/questions/:questionID/:argID",
    views: {
      'menuContent': {
        templateUrl: "templates/arg.html",
        controller: 'ArgCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })  

  .state('question.voters', {
    url: "/voters/:questionId",
    views: {
      'menuContent': {
        templateUrl: "templates/voters.html",
        controller: 'VotersCtrl'
      }
    },
    access: {
      requireLogin: true
    }
  }) 

  .state('question.votersarg', {
    url: "/votersarg/:argId",
    views: {
      'menuContent': {
        templateUrl: "templates/voters.html",
        controller: 'VotersCtrl'
      }
    },
    access: {
      requireLogin: true
    }
  })       
  
  .state('compte', {
    url: "/compte",
    abstract: true,
    templateUrl: "templates/menu.html",
    access: {
      requireLogin: false
    }
  })

  .state('compte.points', {
    url: "/points",
    views: {
      'menuContent': {
        templateUrl: "templates/compte.html",
        controller: 'CompteCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })
  
  .state('compte.pointsexplained', {
    url: "/pointsexplained",
    views: {
      'menuContent': {
        templateUrl: "templates/pointsexplained.html",
        controller: 'PointsExplainedCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })
  
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    access: {
      requireLogin: false
    }
  })

  .state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "templates/news.html",
        controller: 'NewsCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  }) 
  
  .state('app.newsread', {
    url: "/news/:newsID",
    views: {
      'menuContent': {
        templateUrl: "templates/newsread.html",
        controller: 'NewsreadCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  }) 
   
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
        controller: 'AboutCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('app.video', {
    url: "/video",
    views: {
      'menuContent': {
        templateUrl: "templates/video.html",
        controller: 'VideoCtrl'
      }
    },
    access: {
      requireLogin: false
    }
  })

  .state('app.contact', {
    url: "/contact",
    views: {
      'menuContent': {
        templateUrl: "templates/contact.html",
        controller: 'ContactCtrl'
      }
    },
    access: {
      requireLogin: true
    }
  })

  
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');
  $httpProvider.interceptors.push('authInterceptor');
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.views.forwardCache(false);
});
