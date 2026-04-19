import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, X, ImageIcon, Loader2, AlertTriangle, Eye, Upload, ImagePlus } from 'lucide-react'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import ProductCard from '../../../Client/src/components/UI/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  milk_type: string
  dietary_tags: string[]
  stock_quantity: number
  is_available: boolean
  is_featured: boolean
  slug?: string
  product_gallery?: { image_url: string; alt_text?: string; is_primary?: boolean }[]
}

interface FormData {
  name: string
  description: string
  price: string
  category: string
  milk_type: string
  unit: string
  dietary_tags: string[]
  stock_quantity: string
  is_available: boolean
  is_featured: boolean
  gallery: { image_url: string; is_primary: boolean }[]
}

interface ImageItem {
  url: string
  file?: File
  is_primary: boolean
}

const categories = ['Tous', 'Milk', 'Yogurt', 'Cheese', 'Butter', 'Creams']
const categoryLabels: Record<string, string> = { 'Milk': 'Lait', 'Yogurt': 'Yaourt', 'Cheese': 'Fromage', 'Butter': 'Beurre', 'Creams': 'Crème' }
const dietaryOptions = ['Organic', 'Lactose-free', 'Probiotic']

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('Tous')
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  
  const initialFormData: FormData = { 
    name: '', 
    description: '', 
    price: '', 
    category: 'Cheese', 
    milk_type: 'Cow', 
    unit: '1L', 
    dietary_tags: [], 
    stock_quantity: '', 
    is_available: true, 
    is_featured: false,
    gallery: []
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [localGallery, setLocalGallery] = useState<ImageItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await api.produits.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) { 
      toast.error('Erreur lors du chargement des produits')
      console.error(err)
    } finally { 
      setLoading(false) 
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase().includes(search.toLowerCase()) || product.description?.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = filterCategory === 'Tous' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const uploadImages = async (): Promise<{ image_url: string; is_primary: boolean }[]> => {
    const uploadedGallery: { image_url: string; is_primary: boolean }[] = []

    for (const item of localGallery) {
      if (item.file) {
        try {
          const result = await api.images.upload(item.file)
          uploadedGallery.push({ image_url: result.image_url, is_primary: item.is_primary })
        } catch (err) {
          console.error('Upload error:', err)
          throw err
        }
      } else {
        uploadedGallery.push({ image_url: item.url, is_primary: item.is_primary })
      }
    }
    return uploadedGallery
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (localGallery.length === 0) {
      toast.error('Veuillez ajouter au moins une image')
      return
    }
    if (!localGallery.some(img => img.is_primary)) {
      toast.error('Veuillez définir une image primaire')
      return
    }

    const loadingToast = toast.loading(editingProduct ? 'Mise à jour...' : 'Création...')
    setIsUploading(true)

    try {
      const finalGallery = await uploadImages()
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        gallery: finalGallery
      }

      if (editingProduct) {
        await api.produits.update(editingProduct.id, productData)
        toast.success('Produit mis à jour !', { id: loadingToast })
      } else {
        await api.produits.create(productData)
        toast.success('Produit créé avec succès !', { id: loadingToast })
      }
      
      setShowModal(false)
      setEditingProduct(null)
      setFormData(initialFormData)
      setLocalGallery([])
      loadProducts()
    } catch (err) { 
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
      toast.error(`Échec : ${errorMsg}`, { id: loadingToast })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (product: Product) => {
    const gallery = product.product_gallery?.map(img => ({
      url: img.image_url,
      is_primary: !!img.is_primary
    })) || []
    
    setEditingProduct(product)
    setLocalGallery(gallery)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || 'Cheese',
      milk_type: product.milk_type || 'Cow',
      unit: product.unit || '1L',
      dietary_tags: product.dietary_tags || [],
      stock_quantity: product.stock_quantity?.toString() || '',
      is_available: product.is_available !== false,
      is_featured: product.is_featured || false,
      gallery: []
    })
    setShowModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const files = e.target.files
    if (!files) return

    const newItems: ImageItem[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      is_primary: isPrimary
    }))

    if (isPrimary) {
      // Remplacer l'ancienne primaire
      setLocalGallery(prev => [
        ...newItems,
        ...prev.filter(img => !img.is_primary)
      ])
    } else {
      setLocalGallery(prev => [...prev, ...newItems])
    }
  }

  const removeImage = (index: number) => {
    setLocalGallery(prev => prev.filter((_, i) => i !== index))
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    const loadingToast = toast.loading('Suppression en cours...')
    try { 
      console.log(`[API] Appel suppression pour: ${productToDelete.id}`)
      await api.produits.delete(productToDelete.id)
      toast.success('Produit supprimé !', { id: loadingToast })
      setShowDeleteModal(false)
      setProductToDelete(null)
      loadProducts() 
    } catch (err) { 
      const errorMsg = err instanceof Error ? err.message : 'Détails non disponibles'
      toast.error(`La suppression a échoué : ${errorMsg}`, { id: loadingToast })
      console.error('Delete error:', err)
    }
  }

  const getStatusBadge = (product: Product) => {
    if (!product.is_available || product.stock_quantity === 0) return 'bg-red-100 text-red-700'
    return 'bg-green-100 text-green-700'
  }

  const getStatusLabel = (product: Product) => {
    if (!product.is_available || product.stock_quantity === 0) return 'Rupture'
    return 'Actif'
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Chargement de la laiterie...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Gestion des produits</h1>
          <p className="text-on-surface-variant text-sm mt-1">{filteredProducts.length} produit(s)</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData(initialFormData); setShowModal(true) }} 
          className="flex items-center justify-center sm:justify-start gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-medium hover:bg-primary-dim transition-colors w-full sm:w-auto text-sm"
        >
          <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Nouveau produit</span> <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm">
          {categories.map(cat => <option key={cat} value={cat}>{cat === 'Tous' ? cat : (categoryLabels[cat] || cat)}</option>)}
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container">
                <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Produit</th>
                <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase hidden md:table-cell">Catégorie</th>
                <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Prix</th>
                <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase hidden sm:table-cell">Stock</th>
                <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Statut</th>
                <th className="text-right px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredProducts.map((product) => {
                const imgUrl = product.product_gallery?.find(img => img.is_primary)?.image_url;
                return (
                  <tr key={product.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-medium text-on-surface text-xs md:text-sm line-clamp-1">{product.name}</span>
                          <p className="text-xs text-on-surface-variant line-clamp-1 hidden sm:block">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-on-surface-variant text-xs md:text-sm hidden md:table-cell">{categoryLabels[product.category] || product.category}</td>
                    <td className="px-3 md:px-6 py-4 font-medium text-on-surface text-xs md:text-sm">{product.price?.toLocaleString()} Ar</td>
                    <td className="px-3 md:px-6 py-4 text-xs md:text-sm hidden sm:table-cell">
                      <span className={product.stock_quantity === 0 ? 'text-error font-medium' : 'text-on-surface'}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product)}`}>
                        {getStatusLabel(product)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <button onClick={() => { setViewingProduct(product); setShowViewModal(true); }} className="p-1.5 md:p-2 hover:bg-surface-container rounded-lg transition-colors" title="Voir">
                          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-on-surface-variant" />
                        </button>
                        <button onClick={() => handleEdit(product)} className="p-1.5 md:p-2 hover:bg-surface-container rounded-lg transition-colors" title="Modifier">
                          <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        </button>
                        <button 
                          onClick={() => {
                            setProductToDelete(product)
                            setShowDeleteModal(true)
                          }} 
                          className="p-1.5 md:p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-error group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <p>Aucun produit trouvé</p>
        </div>
      )}

      {/* MODALE D'AJOUT/MODIFICATION */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant bg-surface-container">
              <h2 className="text-xl font-bold text-on-surface">{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Nom du produit</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                
                {/* GESTION DES IMAGES */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Image Principale</label>
                    <div className="flex items-center gap-4">
                      {localGallery.find(img => img.is_primary) ? (
                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-md">
                          <img src={localGallery.find(img => img.is_primary)?.url} className="w-full h-full object-cover" alt="Primary" />
                          <button type="button" onClick={() => removeImage(localGallery.findIndex(img => img.is_primary))} className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full hover:scale-110 transition-transform">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-28 h-28 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container hover:border-primary transition-all group">
                          <Upload className="w-7 h-7 text-on-surface-variant group-hover:text-primary mb-1" />
                          <span className="text-[10px] font-bold uppercase text-on-surface-variant group-hover:text-primary">Ajouter</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, true)} />
                        </label>
                      )}
                      <p className="text-xs text-on-surface-variant italic max-w-[200px]">C'est l'image qui sera affichée sur la carte produit.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Images Secondaires</label>
                    <div className="grid grid-cols-4 gap-3">
                      {localGallery.filter(img => !img.is_primary).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant group">
                          <img src={img.url} className="w-full h-full object-cover" alt={`Sec ${idx}`} />
                          <button type="button" onClick={() => removeImage(localGallery.indexOf(img))} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container hover:border-primary transition-all group">
                        <ImagePlus className="w-6 h-6 text-on-surface-variant group-hover:text-primary" />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, false)} />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface resize-none outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Catégorie</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface outline-none">
                    {categories.filter(c => c !== 'Tous').map(cat => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Type de lait</label>
                  <select value={formData.milk_type} onChange={(e) => setFormData({ ...formData, milk_type: e.target.value })} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface outline-none">
                    <option value="Cow">Vache</option>
                    <option value="Goat">Chèvre</option>
                    <option value="Sheep">Brebis</option>
                    <option value="Plant-based">Plante</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Prix (Ar)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Stock</label>
                  <input type="number" required value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Tags diététiques</label>
                <div className="flex flex-wrap gap-4">
                  {dietaryOptions.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={formData.dietary_tags.includes(tag)} 
                          onChange={(e) => { 
                            if (e.target.checked) setFormData({ ...formData, dietary_tags: [...formData.dietary_tags, tag] }); 
                            else setFormData({ ...formData, dietary_tags: formData.dietary_tags.filter(t => t !== tag) }) 
                          }} 
                          className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                        />
                      </div>
                      <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} className="w-4 h-4 rounded-md border-outline-variant text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-on-surface">Disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 rounded-md border-outline-variant text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-on-surface">Mise en avant</span>
                </label>
              </div>

              <div className="flex gap-3 pt-6 border-t border-outline-variant">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-outline-variant rounded-xl text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isUploading} className="flex-1 px-4 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingProduct ? 'Enregistrer' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE VISUALISATION (CARTE) */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowViewModal(false)} className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="w-80 md:w-96">
              <ProductCard
                name={viewingProduct.name}
                description={viewingProduct.description}
                price={`${viewingProduct.price.toLocaleString()} Ar / ${viewingProduct.unit}`}
                imageUrl={viewingProduct.product_gallery?.find(img => img.is_primary)?.image_url || "/placeholder-product.png"}
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-6">Aperçu de la carte côté client</p>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION (PREMIUM) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-[2rem] w-full max-w-sm shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100 animate-bounce">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Supprimer le produit ?</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-on-surface">"{productToDelete?.name}"</span> ? Cette action est irréversible.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  Oui, supprimer
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold hover:bg-surface-container-highest transition-all active:scale-95"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
