Baztille App
=====================

Baztille est un mouvement de citoyens pour réinventer la démocratie.
[En savoir plus](http://baztille.org)

## A propos du client Baztille

Le client Baztille est développé avec [Ionic Framework](http://ionicframework.com/).

Ionic est un framework qui permet de développer des applications hybrides pour mobile. Il utilise notamment Cordova et AngularJS. Nous utilisons ce client pour les versions web (responsive), Android et iOS.

## Installation

Avant de commencer, assurez-vous d'avoir installé node, NPM, Gulp, Bower mais aussi `ionic` :

```bash
$ npm install -g ionic
```

Puis

```bash
# Cloner le repo
$ git clone git://github.com/Baztille/app.git
$ cd app
$ npm install
$ ionic state restore
$ npm install -g bower (si pas installer)
$ bower install
# Configurer l'URL de l'API et services tiers dans config.js
# après configuration, lancer la configuration de baztille
$ gulp install-baztille

# Demarrer le serveur
$ ionic serve

# Ajouter une platforme
$ ionic platform android
$ ionic platform ios

# Lancer l'application
$ ionic run ios
$ ionic run android

```

Pour plus d'infos sur ionic framework ? [Ionic Framework](http://ionicframework.com)

## Contribuer

1. Forker le projet sur GitHub
2. Créer une branche avec votre correctif (`git checkout -b mon-correctif`)
3. Commit et Push (`git commit -m 'mon super correctif'`)
4. Créer un Pull request sur Github

## Contributeurs

Vous êtes les bienvenues ! 🎉

Le projet est maintenu par : 

* [sourisdudesert](https://github.com/sourisdudesert)
* [citymont](https://github.com/citymont)


## License
[GNU](LICENSE)
