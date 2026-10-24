# Buhar Çamaşırhanesi

Dokunmatik ütü ve çamaşırhane oyunu. Oyunun tamamı `www/index.html` içinde (HTML + CSS + vanilla JS, Canvas çizimleri, Web Audio sesleri). iOS uygulaması [Capacitor](https://capacitorjs.com) ile bu dosyayı paketler.

| Klasör / dosya | Ne işe yarar |
|---|---|
| `www/` | Oyunun kendisi, gömülü fontlar, web ikonları, `privacy.html` |
| `ios/` | Capacitor'ın ürettiği Xcode projesi (Bundle ID `com.buharcamasirhanesi.oyun`, yalnızca iPhone, dikey) |
| `scripts/make-assets.mjs` | Uygulama ikonu ve açılış ekranını üretir (`npm run assets`) |
| `.github/workflows/ios-testflight.yml` | GitHub'ın Mac sunucusunda derler, App Store Connect'e yükler |
| `.github/workflows/web.yml` | `www/` klasörünü GitHub Pages'e yayınlar |

## Oyunu değiştirdikten sonra

```bash
npm run sync
```

`www/` içeriğini iOS projesine kopyalar. GitHub'a gönderdiğinde derleme hattı bunu kendisi de yapar.

## App Store'a giden yol (Mac gerekmez)

### 1. Apple Developer Program üyeliği
[developer.apple.com/programs](https://developer.apple.com/programs/) üzerinden kaydol (yıllık 99 $). Onay genellikle 1-2 gün sürer. Şirket adına yayınlayacaksan D-U-N-S numarası gerekir.

### 2. Kodu GitHub'a koy
GitHub'da yeni bir depo aç ve bu klasörü gönder:

```bash
git remote add origin https://github.com/KULLANICI/buhar-camasirhanesi.git
```

```bash
git push -u origin main
```

### 3. Hemen iPhone'da oyna (isteğe bağlı, üyeliği beklerken)
GitHub'da **Settings → Pages → Source: GitHub Actions** seç. `Web → GitHub Pages` iş akışı çalışınca oyun `https://KULLANICI.github.io/buhar-camasirhanesi/` adresinde açılır. iPhone'da Safari ile aç, **Paylaş → Ana Ekrana Ekle** de; uygulama gibi tam ekran çalışır. (Ücretsiz GitHub planında Pages için depo herkese açık olmalı.)

Gizlilik politikası da aynı sitede: `https://KULLANICI.github.io/buhar-camasirhanesi/privacy.html`. App Store bu adresi ister.

### 4. App Store Connect'te uygulama kaydı
1. [developer.apple.com → Identifiers](https://developer.apple.com/account/resources/identifiers/list) → **+** → App IDs → Bundle ID: `com.buharcamasirhanesi.oyun`
2. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **Uygulamalar → + → Yeni Uygulama**: Platform iOS, ad "Buhar Çamaşırhanesi" (alınmışsa ufak bir değişiklik yap), birincil dil Türkçe, aynı Bundle ID, SKU örn. `buhar-001`.

### 5. Derleme hattı için API anahtarı
App Store Connect → **Kullanıcılar ve Erişim → Entegrasyonlar → App Store Connect API → Takım Anahtarları → +**. Rol olarak **Admin** seç (bulutta imzalama sertifikasını otomatik oluşturabilmesi için). `.p8` dosyasını indir; yalnızca bir kez indirilebilir.

GitHub deposunda **Settings → Secrets and variables → Actions → New repository secret** ile şu dördünü ekle:

| Secret | Nereden |
|---|---|
| `APPLE_TEAM_ID` | developer.apple.com → Membership details → Team ID (10 karakter) |
| `ASC_KEY_ID` | API anahtarları listesindeki Key ID |
| `ASC_ISSUER_ID` | Aynı sayfanın üstündeki Issuer ID |
| `ASC_KEY_P8` | İndirdiğin `.p8` dosyasının tüm metni (BEGIN/END satırları dahil) |

`.p8` dosyasını asla depoya koyma (`.gitignore` engelliyor).

### 6. Derle ve yükle
GitHub → **Actions → iOS → TestFlight → Run workflow**. Yaklaşık 10-15 dakika sürer. Bittiğinde derleme App Store Connect → TestFlight altında görünür (Apple'ın işlemesi 10-30 dakika daha sürebilir).

Her yeni sürümde derleme numarası otomatik artar. Görünen sürümü (1.0 → 1.1) değiştirmek için `ios/App/App.xcodeproj/project.pbxproj` içindeki `MARKETING_VERSION` değerini güncelle.

### 7. iPhone'da TestFlight ile dene
iPhone'a **TestFlight** uygulamasını kur. App Store Connect → TestFlight → **Dahili Test** grubuna kendini ekle; davet e-postasıyla oyunu yükle.

### 8. App Store'a gönder
App Store Connect → uygulaman → **iOS Uygulaması 1.0**:
- **Ekran görüntüleri:** 6.9" iPhone için en az 1 adet (1320×2868 veya 1290×2796). En kolayı: TestFlight sürümünü bir Pro Max iPhone'da oynayıp ekran görüntüsü almak.
- **Açıklama, anahtar kelimeler, destek URL'si, gizlilik politikası URL'si** (3. adımdaki adres)
- **Uygulama Gizliliği:** "Veri toplamıyoruz" seç; oyun hiçbir veri toplamıyor.
- **Yaş derecelendirmesi** anketi (her şeye "Hayır" → 4+)
- **Kategori:** Oyunlar → Simülasyon
- **Derleme:** TestFlight'taki derlemeyi seç → **İncelemeye Gönder**

Apple incelemesi genellikle 1-3 gün sürer.

## Mağaza metni taslağı

**Alt başlık (30 karakter):** Ütüle, leke çıkar, para kazan

**Açıklama:**
Mahallenin en sevimli çamaşırhanesi senin! Müşteriler kırışık tişörtleri, gömlekleri, pantolonları ve elbiseleriyle kapıda bekliyor. Parmağını kumaşın üzerinde gezdir, buharla kırışıkları aç, sabırları tükenmeden teslim et.

- Kahve, şarap ve mürekkep lekelerini deterjan köpüğüyle çöz
- Ütüyü bir yerde fazla tutma, kumaş yanar ve ödeme düşer
- Sabırsız ve VIP müşterilere yetiş, bahşişleri topla
- Her 3 müşteriden sonra gece vardiyasında makineleri doldur, bonus kazan
- Kazandığın parayla Buharlı, Sanayi Tipi ve Titanyum Lazer ütüleri satın al

İnternet gerekmez, reklam yok, veri toplanmaz.

**Anahtar kelimeler:** ütü,çamaşır,çamaşırhane,simülasyon,leke,buhar,kıyafet,rahatlatıcı,dükkan,iş
