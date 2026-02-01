# AutoTrack - AI-Powered Expense Tracker

AutoTrack is an intelligent personal finance tracker that automatically extracts and categorizes expenses from receipts, emails, and text input using OCR and NLP. It visualizes spending trends and provides smart insights to help you manage your finances better.

## Features

- **User Authentication**: Secure sign-up/login with Supabase Auth
- **Receipt Upload**: Upload receipt images or paste email text for automatic extraction
- **OCR Processing**: Extract text from receipt images using Tesseract.js (client-side)
- **NLP Extraction**: Use HuggingFace Transformers to detect:
  - Vendor name
  - Transaction amount
  - Date
  - Category (Food & Dining, Transportation, Shopping, etc.)
- **Auto-Categorization**: Automatically classify transactions with manual correction support
- **Interactive Dashboard**: View spending with:
  - Summary cards (total spent, transaction count, top category)
  - Category breakdown (pie chart)
  - Monthly spending trends (line chart)
  - Category comparison (bar chart)
- **Smart Insights**: Get AI-generated summaries like "You spent 20% more on dining this month"
- **Transaction Management**: Full CRUD operations for expense records

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth with SSR
- **OCR**: Tesseract.js (client-side)
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: HuggingFace Transformers (BERT-based NER)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Deployment**: Ready for Vercel (frontend) + Railway/Render (backend)

## Project Structure

```
AutoTrack/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── auth/        # Login/signup pages
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   └── api/         # API routes (if needed)
│   │   ├── components/      # React components
│   │   │   ├── ui/          # UI components
│   │   │   ├── charts/      # Chart components
│   │   │   └── upload/      # Upload components
│   │   ├── lib/             # Utilities
│   │   │   ├── supabase/    # Supabase client config
│   │   │   └── utils.ts     # Helper functions
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # FastAPI application
│   ├── api/                # API endpoints
│   │   ├── extract.py      # Receipt text extraction
│   │   ├── transactions.py # CRUD operations
│   │   └── summary.py      # Analytics & insights
│   ├── ml/                 # Machine learning
│   │   └── extractor.py    # NLP extraction pipeline
│   ├── database/           # Database clients
│   │   └── supabase_client.py
│   ├── utils/              # Utilities
│   │   └── models.py       # Pydantic models
│   ├── main.py            # FastAPI app entry
│   └── requirements.txt
│
├── database_schema.sql     # Database schema
├── seed_data.sql          # Example data
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AutoTrack
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In the Supabase dashboard, go to **SQL Editor**
3. Run the `database_schema.sql` file to create tables and policies
4. Go to **Settings** > **API** and copy:
   - Project URL
   - `anon` public key (for frontend)
   - `service_role` key (for backend - keep secret!)

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

The frontend will run at `http://localhost:3000`

### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (if using spaCy)
# python -m spacy download en_core_web_sm

# Create environment file
cp .env.example .env

# Edit .env and add your Supabase credentials:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_service_role_key
# ALLOWED_ORIGINS=http://localhost:3000

# Start the server
python main.py
```

The backend will run at `http://localhost:8000`

### 5. First-Time Setup

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" and create an account
3. You'll be redirected to the dashboard

### 6. Add Demo Data (Optional)

1. After creating an account, get your user ID from Supabase:
   - Go to Supabase Dashboard > Authentication > Users
   - Copy your user's UUID
2. Edit `seed_data.sql` and replace `YOUR_USER_ID_HERE` with your UUID
3. Run the seed SQL in Supabase SQL Editor

## API Endpoints

### Backend API

- **POST** `/api/extract` - Extract expense data from receipt text
  ```json
  {
    "text": "Starbucks\n$5.75\n10/24/2024"
  }
  ```

- **GET** `/api/transactions?user_id={user_id}` - Get all transactions
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions/{id}` - Update transaction
- **DELETE** `/api/transactions/{id}` - Delete transaction
- **GET** `/api/summary?user_id={user_id}` - Get spending summary and insights

## Usage

### Upload a Receipt

1. Go to the Dashboard
2. Click "Upload Receipt" or "Paste Text"
3. For images: Drag and drop or click to select
4. For text: Paste receipt text or email content
5. Click "Process Receipt" or "Extract Data"
6. Review the extracted data in the form
7. Make any corrections needed
8. Click "Save Transaction"

### View Analytics

The dashboard displays:
- **Summary Cards**: Total spent, transaction count, top category, average
- **Pie Chart**: Spending distribution by category
- **Line Chart**: Monthly spending trends
- **Bar Chart**: Category comparison
- **Smart Insights**: AI-generated spending insights

### Manage Transactions

- View all transactions in the table at the bottom
- Delete transactions with the trash icon
- Transactions are sorted by date (newest first)

## Deployment

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy

**Frontend (Vercel):**
1. Push code to GitHub
2. Import repository on Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy!

**Backend (Render):**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions with screenshots and troubleshooting tips.

## Development Notes

### NLP Model

The backend uses `dslim/bert-base-NER` from HuggingFace for named entity recognition. On first run, it will download the model (~400MB). For production, consider:
- Caching the model in Docker images
- Using model quantization for faster inference
- Switching to a lighter model if needed

### OCR Accuracy

Tesseract.js works best with:
- Clear, high-contrast images
- Good lighting
- Horizontal text orientation
- Standard fonts

For better accuracy, you can:
- Preprocess images (crop, enhance contrast)
- Use backend OCR with Pytesseract
- Implement confidence thresholds

### Security

- All Supabase queries use Row Level Security (RLS)
- Users can only access their own transactions
- Use environment variables for secrets
- Never commit `.env` files

## Troubleshooting

### Frontend won't start
- Check Node version (18+)
- Delete `node_modules` and `package-lock.json`, reinstall
- Verify `.env.local` has correct Supabase credentials

### Backend errors
- Ensure Python 3.9+ is installed
- Activate virtual environment
- Check `.env` has correct Supabase service role key
- First run may take time to download ML models

### Database connection failed
- Verify Supabase credentials
- Check if database schema was run
- Ensure RLS policies are enabled

### OCR not working
- Check browser console for errors
- Ensure image is clear and properly formatted
- Try with sample receipts first

## Future Enhancements

- [ ] Natural language query ("What did I spend on coffee last week?")
- [ ] Budget goals and alerts
- [ ] Recurring expense detection
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Receipt image preprocessing
- [ ] Multi-currency support
- [ ] Team/family expense sharing

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review API documentation at `http://localhost:8000/docs`

---

**Built with** ❤️ **using Next.js, FastAPI, and Supabase**
