Voici un exemple de fichier README pour votre script :

# Script de Surveillance de Prix avec Notification Discord

Ce script en Node.js est conçu pour surveiller le prix d'un produit sur un site web spécifique à intervalles réguliers et notifier les utilisateurs via Discord en cas de changement de prix.

## Configuration

1. Assurez-vous d'avoir Node.js installé sur votre système.

2. Installez les dépendances requises en exécutant la commande suivante :
   ```
   npm install axios node-cron fs cheerio discord-webhook-node
   ```

3. Copiez le fichier `config.example.js` et renommez-le en `config.js`. Remplissez les informations nécessaires dans ce fichier, notamment l'URL du site à surveiller et le lien du webhook Discord.

## Utilisation

- Pour exécuter le script, utilisez la commande :
  ```
  node monitor.js
  ```

- Le script surveille le site web à intervalles réguliers (toutes les 5 minutes dans cet exemple) en utilisant `node-cron`.

- Si le prix du produit diminue, une notification Discord sera envoyée via le webhook configuré.

## Structure des Données

Les données sont stockées dans un fichier JSON nommé `data.json`. Chaque entrée dans ce fichier contient les informations suivantes :

- `price`: Le prix actuel du produit.
- `date`: La date et l'heure de la vérification du prix.

## Remarques

- Le script utilise la bibliothèque `cheerio` pour extraire les informations du site web.
- Les notifications Discord sont envoyées via `discord-webhook-node`.
- Vous pouvez personnaliser les intervalles de vérification et les messages Discord en modifiant le script.

N'hésitez pas à personnaliser ce README en fonction de vos besoins spécifiques et à fournir des instructions supplémentaires si nécessaire.