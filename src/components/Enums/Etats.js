export const ETATS = {
    NOUVEAU: { name: 'Nouveau', color: '#ff7300' },
    EN_COURS: { name: 'En cours', color: '#ff6f00' },
    REUSSI: { name: 'Reussi', color: '#00c49f' },
    EN_ATTENTE: { name: 'En attente', color: '#8884d8' },
    ABANDONNE: { name: 'Abandonne', color: '#d0d0d0' },
}

export const ETAT_TERMINE = [
    ETATS.REUSSI,
    ETATS.ABANDONNE,
]