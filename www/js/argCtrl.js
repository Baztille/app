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

appBaztille.controller('ArgCtrl', function(Questions, UxQuestions, $scope, $timeout, $state, $location, $ionicSideMenuDelegate, $window, $ionicLoading, $ionicModal, $ionicPopup, $http, $stateParams,$ionicPopover) {
  $ionicSideMenuDelegate.canDragContent(true);

      // destroy modals on destroy view
      $scope.$on('$destroy', function() { 
        $scope.modalNewArg.remove();
        $scope.modalPromoteShare.remove();
        $scope.modalVoters.remove();
        $scope.modalReport.remove();
      });

      // Create the arg proposing modal that we will use later
      $ionicModal.fromTemplateUrl('templates/newarg.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalNewArg = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeNewArg = function() {
        $scope.modalNewArg.hide();
      };

      // Open the login modal
      $scope.newArg = function() {
        $scope.newArgData.text = '';
        $scope.newArgData.bConfirmation = false;
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.modalNewArg.show();
      };

      $scope.questionId = $stateParams.questionID;
      $scope.argId = $stateParams.argID;

      /* keep scroll position */

      $scope.scrollSavePos = function( ) {
        var scrollPosition = document.querySelector('.ionic-scroll');
        $window.localStorage.argLastPos = scrollPosition.scrollTop;
      }
      
      $scope.$on('$ionicView.loaded', function(){
        $timeout(function () {
          var scrolldiv = document.querySelector('.ionic-scroll');
              scrolldiv.scrollTop = $window.localStorage.argLastPos;
              delete $window.localStorage.argLastPos;
        }, 1000);
             
      });
      
      $scope.onWhyLimit = function() {
        UxQuestions.onWhyLimit();
      };
      
      $scope.shareNative = function(message,link) {
        UxQuestions.shareNative(message,link);
      };

      $scope.reloadQuestion = function()
      {
            Questions.getQuestion( {
                id:$scope.questionId,
                session: $window.localStorage.token
            } ).then( function(resp) {

                if( resp.data.error )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: resp.data.error_descr
                   });
                }
                else
                {
                    $scope.show_new_argument = true;
                    if( resp.data.question.status != 'proposed' && resp.data.question.status != 'vote' )
                    {
                        $scope.show_new_argument = false;
                    }

                    // Trying to find the current argument in the arg tree
                    var current_arg = $scope.findArgById( $scope.argId, resp.data.args, 1 );

                    if( current_arg == null )
                    {
                        return ;
                    }

                    if( current_arg.depth == 1 )
                    {
                        // Argument
                        $scope.label_title = 'argument';
                        $scope.label_title2 = 'sous-argument';
                        $scope.modal_title = 'Nouvel argument';
                        $scope.new_answer_on = 'Nouvel argument sur la réponse';
                        $scope.your_answer = 'Votre argument';
                        $scope.propose_a_new_argument = 'Proposer un nouvel argument'; 
                        $scope.page_title = 'Réponse "'+current_arg.text+'"';      
                        $scope.header_title = 'Réponse proposée';
                        $scope.header_date_proposed = current_arg.date;
                        $scope.header_date_proposed_formated = moment(current_arg.date,'X').fromNow()
                    }
                    else if( current_arg.depth == 2 )
                    {
                        // Sub argument
                        $scope.label_title = 'sous-argument';
                        $scope.label_title2 = 'sous-argument';
                        $scope.modal_title = 'Nouveau sous-argument';
                        $scope.new_answer_on = "Nouvel sous-argument sur l'argument";
                        $scope.your_answer = 'Votre sous-argument';          
                        $scope.propose_a_new_argument = 'Proposer un nouveau sous-argument';              
                        $scope.page_title = 'Argument "'+current_arg.text+'"';             
                        $scope.header_title = 'Argument proposé';
                        $scope.header_date_proposed = current_arg.date;
                        $scope.header_date_proposed_formated = moment(current_arg.date,'X').fromNow()
                    }

                    $scope.current_arg_depth = current_arg.depth;
                    var status = resp.data.question.status;
                    $scope.initial_question_title = resp.data.question.text;
                    $scope.initial_question_status = status;
                    $scope.initial_question_date_proposed = resp.data.question.date_proposed;
                   

                    if( status == 'proposed' )
                    {
                        // some times to be validated
                        var date = moment(resp.data.question.date_proposed,'X').fromNow();
                        status_explanation = "Votez pour cette question pour qu'elle soit sélectionnée et soumise au vote (encore "+resp.data.question.remaining_attempts+' tentatives).';
                        date_prefix = 'Argument proposé';
                        $scope.question_vote_visible = true;
                        $scope.question_header_margin = 75;

                    }
                    else if( status == 'rejected' )
                    {
                        var date = moment(resp.data.question.date_proposed,'X').fromNow();
                        status_explanation = "Cette question n'a pas intéressé suffisamment de membres pour être mise au vote.";
                        date_prefix = 'Proposée ';
                        $scope.new_answer_visible = false;
                    }
                    else if( status == 'vote' )
                    {
                        status_explanation = "Votez pour la ou les réponses qui vous paraissent les meilleures.";
                        date = moment(resp.data.question.date_vote_,'X').fromNow();
                        date_prefix = 'En cours de vote jusque ';
                        $scope.question_vote_visible = true;

                    }
                    else if( status == 'decided' )
                    {
                        status_explanation = "Question déjà débattue et votée.";
                        date = moment(resp.data.question.date_decided,'X').fromNow();
                        date_prefix = 'Argument débattu et voté ';

                    }

                    $scope.initial_question_date_prefix = date_prefix;
                    $scope.initial_question_status_explanation = status_explanation;
                    $scope.initial_question_date = date;

                    if( typeof resp.data.myvotes[ current_arg._id.$id ] != 'undefined' )
                        {   voted = 'voted';    }

                    $scope.question = { 
                        title: current_arg.text,
                        vote: current_arg.vote,
                        date_proposed: date,
                        voted: voted,
                        url: 'http://app.baztille.org/question/questions/'+$scope.questionId+'/'+$scope.argId+'?source=share',
                        argnbr: current_arg.args.length,
                    };

                    if(!window.cordova) { // Force update title
                        document.title = 'Baztille - Argument : ' + $scope.question.title;
                    }
                    
                    $scope.args = [];

                    for( var i in current_arg.args )
                    {
                        var arg = current_arg.args[i];

                        var voted = '';
                        if( typeof resp.data.myvotes[ arg._id.$id ] != 'undefined' )
                        {   voted = 'voted';    }
                        
                        var date = moment(arg.date,'X').fromNow();

                        $scope.args.push( { 
                            text: arg.text, 
                            id: arg._id.$id, 
                            vote: arg.vote,
                            argnbr: arg.args.length,
                            showargnbr: current_arg.depth==2 ? 0: 1,
                            question_id: $scope.questionId ,
                            voted: voted,
                            date: date,
                            arguments: arg.args.length==0 ? '': ( arg.args.length > 1 ? 'sous-arguments' : 'sous-argument' ),
                            link: current_arg.depth == 2 ? true : false
                        } );
                    }
                }

                // - show promotion 
                if($state.current.name == 'question.argpromote' ) { 
                    $scope.promoteShare();
                }

            }, function( err ) {
                //console.error('ERR', err);
            } );
      
      };

    $scope.reloadQuestion();
    
    $scope.findArgById = function( arg_id, args, depth )
    {
        for( var i in args )
        {
            if( args[i]._id.$id == arg_id )
            {
                args[i].depth = depth;
                return args[i];
            }
            else
            {
                var result = $scope.findArgById( arg_id, args[i].args, depth+1 );
                if( result !== null )
                {   return result;  }
            }
        }    
        
        return null;
    };
    
    
    
    // Form data for the login modal
    $scope.newArgData = { text: '' };

    //  Doing new argument posting
    //  $scope.newArgData


    $scope.doNewArg = function() {

        // At first, we do a confirmation step
        $scope.newArgData.text_br = $scope.newArgData.text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $scope.newArgData.bConfirmation = true;
    }; 

    $scope.fixNewArg = function() {
        // Back to edition
        $scope.newArgData.bConfirmation = false;
    };

    $scope.confirmNewArg = function() {
        // Post new arg
          $scope.newArgData.id = $scope.questionId;
          $scope.newArgData.session = $window.localStorage.token;
          $scope.newArgData.parent = $scope.argId;  // Parent argument

          Questions.newArg($scope.newArgData).success(function(data){            
            if( data.error )
            {
                
                if( data.error_code != 570 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: data.error_descr
                    });
                }
                else
                {  
                    UxQuestions.errorEmailNotConfirmed(data);
                } 

            }
            else
            {

                $scope.modalNewArg.hide();
                $state.go('question.argpromote',{ questionID: $scope.questionId, argID: data.id.$id });
                //$scope.reloadQuestion();
            }
         });

    };

    /* voter */

      // Create the promote/share modal
      $ionicModal.fromTemplateUrl('templates/small/voters.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalVoters = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeVoters = function() {
        $scope.modalVoters.hide();
      };

      $scope.openVoters = function() {
        $scope.modalVoters.show();

        $scope.isArg = true;

        if( $stateParams.questionID )
        {
            $scope.id = $stateParams.argID;
        }

        Questions.listVoters( {
            id:$scope.id,
            isArg: $scope.isArg,
            session: $window.localStorage.token
        } ).success(function(data){
            
            if($scope.current_arg_depth==1) {
                $scope.contribution_text = "cette réponse";
            }
            if($scope.current_arg_depth==2) {
                $scope.contribution_text = "cet argument";
            }
            if($scope.current_arg_depth==3) {
                $scope.contribution_text = "ce sous-argument";
            }

            $scope.data = data;
            $scope.voters_nbr = data.voters.length;
            
        } );    
    

      };


    //  Voting for arg

    $scope.voteProposed = function( post_id , $event)
    {

        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        Questions.vote( {
            id:post_id,
            session: $window.localStorage.token
        } ).success(function(data){
            
            if( data.error )
            {
                if( data.error_code != 570 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: data.error_descr
                    });
                }
                else
                {  
                    UxQuestions.errorEmailNotConfirmed(data);
                } 
            }
            else
            {
                UxQuestions.incrementVote($event);
            }            
        } );
        

    };

    $scope.actionQuest = function(question, $event) {

        if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;

            var alertPopup = $ionicPopup.show({
            title: '',
            subTitle: '',
            template: question.id,
            cssClass: "popup-vertical-buttons-no-head",
            buttons: [
            {
                text: 'Liste votants',
                type: 'button-default',
                onTap: function(e) {
                    $scope.openVoters();
                }
            },
            /*{ 
                text: 'Modifier',
                type: 'button-default',
                onTap: function(e) {
                   $scope.editContribution();
                }
            },*/
            { 
                text: 'Signaler',
                type: 'button-default',
                onTap: function(e) {
                  //$state.go('question.argreport',{ questionID: question.id, argID: arg.id });
                  $scope.report();
                }
            },
            { 
                text: 'Aide',
                type: 'button-default',
                onTap: function(e) {
                  $state.go('app.about');
                }
            },
            { text: 'Retour' }

            ]
        });
    }


      /* Share / promote modal */

      // Create the promote/share modal
      $ionicModal.fromTemplateUrl('templates/small/promoteandsharearg.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalPromoteShare = modal;
      });

      // Triggered in the login modal to close it
      $scope.closePromoteShare = function() {
        $scope.modalPromoteShare.hide();
      };

      $scope.promoteShare = function() {
        $scope.sharebox = 'expanded';
        $scope.promotebox = 'expanded';
       
        if($scope.current_arg_depth==1) {
            $scope.promote_text = "réponse";
            $scope.promote_text2 = "publiée";
            $scope.promote_text3 = "la réponse";
        }
        if($scope.current_arg_depth==2) {
            $scope.promote_text = "argument";
            $scope.promote_text2 = "publié";
            $scope.promote_text3 = "l'argument";
        }
        if($scope.current_arg_depth==3) {
            $scope.promote_text = "sous-argument";
            $scope.promote_text2 = "publié";
            $scope.promote_text3 = "le sous-argument";
        }

        $scope.modalPromoteShare.show();
      };

      $scope.simpleShare = function() {

        if($scope.current_arg_depth==1) {
            $scope.promote_text = "réponse";
            $scope.promote_text2 = "publiée";
            $scope.promote_text3 = "la réponse";
        }
        if($scope.current_arg_depth==2) {
            $scope.promote_text = "argument";
            $scope.promote_text2 = "publié";
            $scope.promote_text3 = "l'argument";
        }
        if($scope.current_arg_depth==3) {
            $scope.promote_text = "sous-argument";
            $scope.promote_text2 = "publié";
            $scope.promote_text3 = "le sous-argument";
        }

        $scope.sharebox = 'expanded';
        $scope.promotebox = '';
        $scope.shareboxTitle = 'show';
        $scope.modalPromoteShare.show();
      };

    /* Report modal */

      // Create the promote/share modal
      $ionicModal.fromTemplateUrl('templates/small/report.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalReport = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeReport = function() {
        $scope.modalReport.hide();
      };

      $scope.report = function() {
        $scope.reportWhat = 'argument';
        $scope.reportID = $scope.argId;
        $scope.modalReport.show();
      };

      $scope.sendReport = function(reportAnswer) {
        //console.log($scope.reportID,$scope.reportWhat,reportAnswer);
        $scope.closeReport();
      }

    // Characters left counter
    $scope.maxChars = 200;
    $scope.ngCharacterCount = $scope.maxChars;
    $scope.inputChange = function() { UxQuestions.inputChange( $scope, $scope.newArgData.text ); }
    
  
    //Edit menu
    //
    $ionicPopover.fromTemplateUrl('templates/small/arg-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popoverMenu = popover;
    });


    $scope.openPopoverMenu = function($event) {
        $scope.popoverMenu.show($event);
    };
    $scope.closePopoverMenu = function($event) {
        $scope.popoverMenu.hide($event);
    };
    
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popoverMenu.remove();
    }); 
    

 
});
