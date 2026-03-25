from pymongo import MongoClient

client= MongoClient("mongodb://localhost:27017/")
db= client["gestion_produits"]
base= db["produits"]

def ajouter():
    produit={}
    numero = int(input("entrez votre numero :"))
    nom_prod = input("entrez votre nom_prod :")
    prix = int(input("entrez votre prix_prod :"))
    quantite = int(input("entrez votre quantite :"))

    produit["Numero"]=numero
    produit["Nom_prod"]=nom_prod
    produit["Prix_prod"]=prix
    produit["Quantite"]=quantite

    base.insert_one(produit)

print("produit ajoutée avec succès")


for i in range(3):
        print(f" Produit {i+1} :")
        ajouter()
def afficher():
        
        print("\n------------Liste des produits ----------------")
        for produit in base.find():
            print(f" le nom du produit :{produit["Nom_prod"]} ")
            print(f" le prix du produit :{produit["Prix_prod"]} ")
            print(f" la quantite du produit :{produit["Quantite"]} ")
        print("---------------------------------------------------------")

afficher()

def supprimer():
      numero=int(input("entrez le numero"))
      filter={"Numero":numero}
      choix=input("Veuillez taper la lettre s ou 0 pour supprimer le produit")

      if (choix=="0"):
            base.delete_one(filter)
            print("produit selectionné a été supprimé avec succès.")

      else:
            print("suppression annullée.")
      
# supprimer()
afficher()




def modifier():
        numero=int(input("entrez le numero du produit a modifier "))
        nouveau_prix=int(input(f"Veuillez entrez le nouveau prix pour le prodiuit numero {numero}"))
        base.update_one(
            {"Numero":numero},
            {"$set":{"Prix_prod": nouveau_prix}})
        

# modifier()
afficher()

      









    


