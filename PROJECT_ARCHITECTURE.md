
# EduMart - Project Architecture Documentation

## Project Overview
EduMart is a comprehensive educational resource sharing platform built with React, TypeScript, Tailwind CSS, and Supabase. The platform enables students and educators to share academic materials including books, notes, presentations, and projects.

## Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Reusable component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication system
- **Supabase Storage** - File storage
- **Row Level Security (RLS)** - Data security

## Architecture Diagrams

### 1. High-Level System Architecture

```svg
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="600" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="400" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">EduMart System Architecture</text>
  
  <!-- Client Layer -->
  <rect x="50" y="80" width="700" height="120" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10"/>
  <text x="400" y="105" text-anchor="middle" font-size="16" font-weight="bold" fill="#0c4a6e">Client Layer</text>
  
  <!-- React Components -->
  <rect x="80" y="120" width="120" height="60" fill="#bfdbfe" stroke="#3b82f6" rx="5"/>
  <text x="140" y="145" text-anchor="middle" font-size="12" fill="#1e40af">React</text>
  <text x="140" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Components</text>
  
  <!-- TypeScript -->
  <rect x="220" y="120" width="120" height="60" fill="#bfdbfe" stroke="#3b82f6" rx="5"/>
  <text x="280" y="145" text-anchor="middle" font-size="12" fill="#1e40af">TypeScript</text>
  <text x="280" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Type Safety</text>
  
  <!-- Tailwind CSS -->
  <rect x="360" y="120" width="120" height="60" fill="#bfdbfe" stroke="#3b82f6" rx="5"/>
  <text x="420" y="145" text-anchor="middle" font-size="12" fill="#1e40af">Tailwind CSS</text>
  <text x="420" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Styling</text>
  
  <!-- React Router -->
  <rect x="500" y="120" width="120" height="60" fill="#bfdbfe" stroke="#3b82f6" rx="5"/>
  <text x="560" y="145" text-anchor="middle" font-size="12" fill="#1e40af">React Router</text>
  <text x="560" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Navigation</text>
  
  <!-- TanStack Query -->
  <rect x="640" y="120" width="120" height="60" fill="#bfdbfe" stroke="#3b82f6" rx="5"/>
  <text x="700" y="145" text-anchor="middle" font-size="12" fill="#1e40af">TanStack</text>
  <text x="700" y="160" text-anchor="middle" font-size="12" fill="#1e40af">Query</text>
  
  <!-- API Layer -->
  <rect x="50" y="250" width="700" height="100" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" rx="10"/>
  <text x="400" y="275" text-anchor="middle" font-size="16" font-weight="bold" fill="#166534">API Layer</text>
  
  <!-- Supabase Client -->
  <rect x="200" y="290" width="180" height="40" fill="#bbf7d0" stroke="#22c55e" rx="5"/>
  <text x="290" y="315" text-anchor="middle" font-size="12" fill="#15803d">Supabase Client SDK</text>
  
  <!-- REST APIs -->
  <rect x="420" y="290" width="180" height="40" fill="#bbf7d0" stroke="#22c55e" rx="5"/>
  <text x="510" y="315" text-anchor="middle" font-size="12" fill="#15803d">REST APIs & Real-time</text>
  
  <!-- Backend Services -->
  <rect x="50" y="400" width="700" height="150" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
  <text x="400" y="425" text-anchor="middle" font-size="16" font-weight="bold" fill="#92400e">Supabase Backend</text>
  
  <!-- Database -->
  <rect x="80" y="450" width="150" height="80" fill="#fed7aa" stroke="#ea580c" rx="5"/>
  <text x="155" y="475" text-anchor="middle" font-size="12" fill="#c2410c">PostgreSQL</text>
  <text x="155" y="490" text-anchor="middle" font-size="12" fill="#c2410c">Database</text>
  <text x="155" y="505" text-anchor="middle" font-size="10" fill="#c2410c">• Users</text>
  <text x="155" y="520" text-anchor="middle" font-size="10" fill="#c2410c">• Resources</text>
  
  <!-- Authentication -->
  <rect x="250" y="450" width="150" height="80" fill="#fed7aa" stroke="#ea580c" rx="5"/>
  <text x="325" y="475" text-anchor="middle" font-size="12" fill="#c2410c">Authentication</text>
  <text x="325" y="490" text-anchor="middle" font-size="12" fill="#c2410c">Service</text>
  <text x="325" y="505" text-anchor="middle" font-size="10" fill="#c2410c">• JWT Tokens</text>
  <text x="325" y="520" text-anchor="middle" font-size="10" fill="#c2410c">• RLS Policies</text>
  
  <!-- Storage -->
  <rect x="420" y="450" width="150" height="80" fill="#fed7aa" stroke="#ea580c" rx="5"/>
  <text x="495" y="475" text-anchor="middle" font-size="12" fill="#c2410c">File Storage</text>
  <text x="495" y="490" text-anchor="middle" font-size="12" fill="#c2410c">Service</text>
  <text x="495" y="505" text-anchor="middle" font-size="10" fill="#c2410c">• Documents</text>
  <text x="495" y="520" text-anchor="middle" font-size="10" fill="#c2410c">• Images</text>
  
  <!-- Edge Functions -->
  <rect x="590" y="450" width="150" height="80" fill="#fed7aa" stroke="#ea580c" rx="5"/>
  <text x="665" y="475" text-anchor="middle" font-size="12" fill="#c2410c">Edge Functions</text>
  <text x="665" y="490" text-anchor="middle" font-size="12" fill="#c2410c">(Optional)</text>
  <text x="665" y="505" text-anchor="middle" font-size="10" fill="#c2410c">• Custom Logic</text>
  <text x="665" y="520" text-anchor="middle" font-size="10" fill="#c2410c">• API Integrations</text>
  
  <!-- Arrows -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
    </marker>
  </defs>
  
  <!-- Client to API -->
  <line x1="400" y1="200" x2="400" y2="250" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- API to Backend -->
  <line x1="400" y1="350" x2="400" y2="400" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
</svg>
```

### 2. Component Architecture

```svg
<svg viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="900" height="700" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="450" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">Component Architecture</text>
  
  <!-- App Component -->
  <rect x="350" y="60" width="200" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="10"/>
  <text x="450" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">App.tsx</text>
  <text x="450" y="105" text-anchor="middle" font-size="12" fill="#1e40af">Main Application</text>
  
  <!-- Router Layer -->
  <rect x="50" y="160" width="800" height="100" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1" rx="5"/>
  <text x="450" y="185" text-anchor="middle" font-size="14" font-weight="bold" fill="#0c4a6e">React Router</text>
  
  <!-- Pages -->
  <rect x="80" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="130" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">Index</text>
  
  <rect x="200" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="250" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">Resources</text>
  
  <rect x="320" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="370" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">Upload</text>
  
  <rect x="440" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="490" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">Dashboard</text>
  
  <rect x="560" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="610" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">Admin</text>
  
  <rect x="680" y="200" width="100" height="40" fill="#bae6fd" stroke="#0ea5e9" rx="3"/>
  <text x="730" y="225" text-anchor="middle" font-size="10" fill="#0c4a6e">About</text>
  
  <!-- Shared Components -->
  <rect x="50" y="300" width="800" height="120" fill="#f0fdf4" stroke="#22c55e" stroke-width="1" rx="5"/>
  <text x="450" y="325" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">Shared Components</text>
  
  <!-- Navbar -->
  <rect x="80" y="350" width="120" height="50" fill="#bbf7d0" stroke="#22c55e" rx="3"/>
  <text x="140" y="370" text-anchor="middle" font-size="11" fill="#15803d">Navbar</text>
  <text x="140" y="385" text-anchor="middle" font-size="9" fill="#15803d">Navigation</text>
  
  <!-- Category Card -->
  <rect x="220" y="350" width="120" height="50" fill="#bbf7d0" stroke="#22c55e" rx="3"/>
  <text x="280" y="370" text-anchor="middle" font-size="11" fill="#15803d">CategoryCard</text>
  <text x="280" y="385" text-anchor="middle" font-size="9" fill="#15803d">Resource Cards</text>
  
  <!-- UI Components -->
  <rect x="360" y="350" width="120" height="50" fill="#bbf7d0" stroke="#22c55e" rx="3"/>
  <text x="420" y="370" text-anchor="middle" font-size="11" fill="#15803d">UI Components</text>
  <text x="420" y="385" text-anchor="middle" font-size="9" fill="#15803d">Shadcn/UI</text>
  
  <!-- Auth Components -->
  <rect x="500" y="350" width="120" height="50" fill="#bbf7d0" stroke="#22c55e" rx="3"/>
  <text x="560" y="370" text-anchor="middle" font-size="11" fill="#15803d">Auth</text>
  <text x="560" y="385" text-anchor="middle" font-size="9" fill="#15803d">Authentication</text>
  
  <!-- Form Components -->
  <rect x="640" y="350" width="120" height="50" fill="#bbf7d0" stroke="#22c55e" rx="3"/>
  <text x="700" y="370" text-anchor="middle" font-size="11" fill="#15803d">Forms</text>
  <text x="700" y="385" text-anchor="middle" font-size="9" fill="#15803d">Input/Upload</text>
  
  <!-- Hooks & Context -->
  <rect x="50" y="460" width="400" height="100" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="5"/>
  <text x="250" y="485" text-anchor="middle" font-size="14" font-weight="bold" fill="#92400e">Hooks & Context</text>
  
  <rect x="80" y="510" width="150" height="40" fill="#fed7aa" stroke="#ea580c" rx="3"/>
  <text x="155" y="535" text-anchor="middle" font-size="11" fill="#c2410c">useAuth Hook</text>
  
  <rect x="250" y="510" width="150" height="40" fill="#fed7aa" stroke="#ea580c" rx="3"/>
  <text x="325" y="535" text-anchor="middle" font-size="11" fill="#c2410c">AuthProvider</text>
  
  <!-- Services -->
  <rect x="500" y="460" width="350" height="100" fill="#fce7f3" stroke="#ec4899" stroke-width="1" rx="5"/>
  <text x="675" y="485" text-anchor="middle" font-size="14" font-weight="bold" fill="#be185d">Services</text>
  
  <rect x="530" y="510" width="130" height="40" fill="#fbcfe8" stroke="#ec4899" rx="3"/>
  <text x="595" y="535" text-anchor="middle" font-size="11" fill="#be185d">Supabase Client</text>
  
  <rect x="680" y="510" width="130" height="40" fill="#fbcfe8" stroke="#ec4899" rx="3"/>
  <text x="745" y="535" text-anchor="middle" font-size="11" fill="#be185d">TanStack Query</text>
  
  <!-- Arrows -->
  <defs>
    <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
    </marker>
  </defs>
  
  <!-- App to Router -->
  <line x1="450" y1="120" x2="450" y2="160" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead2)"/>
  
  <!-- Router to Components -->
  <line x1="450" y1="260" x2="450" y2="300" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead2)"/>
  
  <!-- Components to Services -->
  <line x1="450" y1="420" x2="450" y2="460" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead2)"/>
</svg>
```

### 3. Database Schema

```svg
<svg viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1000" height="800" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="500" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">Database Schema</text>
  
  <!-- Auth Users Table (Supabase managed) -->
  <rect x="50" y="80" width="200" height="150" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="150" y="105" text-anchor="middle" font-size="14" font-weight="bold" fill="#991b1b">auth.users</text>
  <text x="150" y="125" text-anchor="middle" font-size="10" fill="#991b1b">(Supabase Managed)</text>
  <line x1="70" y1="135" x2="230" y2="135" stroke="#991b1b"/>
  <text x="70" y="150" font-size="10" fill="#991b1b">id (UUID) PK</text>
  <text x="70" y="165" font-size="10" fill="#991b1b">email (TEXT)</text>
  <text x="70" y="180" font-size="10" fill="#991b1b">password (ENCRYPTED)</text>
  <text x="70" y="195" font-size="10" fill="#991b1b">created_at (TIMESTAMP)</text>
  <text x="70" y="210" font-size="10" fill="#991b1b">updated_at (TIMESTAMP)</text>
  
  <!-- Profiles Table -->
  <rect x="350" y="80" width="200" height="180" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="10"/>
  <text x="450" y="105" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">profiles</text>
  <line x1="370" y1="115" x2="530" y2="115" stroke="#1e40af"/>
  <text x="370" y="130" font-size="10" fill="#1e40af">id (UUID) PK → auth.users.id</text>
  <text x="370" y="145" font-size="10" fill="#1e40af">email (TEXT)</text>
  <text x="370" y="160" font-size="10" fill="#1e40af">full_name (TEXT)</text>
  <text x="370" y="175" font-size="10" fill="#1e40af">role (user_role)</text>
  <text x="370" y="190" font-size="10" fill="#1e40af">created_at (TIMESTAMP)</text>
  <text x="370" y="205" font-size="10" fill="#1e40af">updated_at (TIMESTAMP)</text>
  <text x="370" y="235" font-size="9" fill="#1e40af">Enum: user_role</text>
  <text x="370" y="250" font-size="9" fill="#1e40af">Values: 'user', 'admin'</text>
  
  <!-- Resources Table -->
  <rect x="650" y="80" width="280" height="250" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="10"/>
  <text x="790" y="105" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">resources</text>
  <line x1="670" y1="115" x2="910" y2="115" stroke="#166534"/>
  <text x="670" y="130" font-size="10" fill="#166534">id (UUID) PK</text>
  <text x="670" y="145" font-size="10" fill="#166534">title (TEXT)</text>
  <text x="670" y="160" font-size="10" fill="#166534">description (TEXT)</text>
  <text x="670" y="175" font-size="10" fill="#166534">category (resource_category)</text>
  <text x="670" y="190" font-size="10" fill="#166534">file_type (file_type)</text>
  <text x="670" y="205" font-size="10" fill="#166534">file_url (TEXT)</text>
  <text x="670" y="220" font-size="10" fill="#166534">file_name (TEXT)</text>
  <text x="670" y="235" font-size="10" fill="#166534">file_size (BIGINT)</text>
  <text x="670" y="250" font-size="10" fill="#166534">preview_image_url (TEXT)</text>
  <text x="670" y="265" font-size="10" fill="#166534">subject (TEXT)</text>
  <text x="670" y="280" font-size="10" fill="#166534">course (TEXT)</text>
  <text x="670" y="295" font-size="10" fill="#166534">download_count (INTEGER)</text>
  <text x="670" y="310" font-size="10" fill="#166534">uploader_id (UUID) FK → profiles.id</text>
  
  <!-- Enums -->
  <rect x="50" y="300" width="200" height="120" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
  <text x="150" y="325" text-anchor="middle" font-size="14" font-weight="bold" fill="#92400e">resource_category</text>
  <line x1="70" y1="335" x2="230" y2="335" stroke="#92400e"/>
  <text x="70" y="350" font-size="10" fill="#92400e">'Books'</text>
  <text x="70" y="365" font-size="10" fill="#92400e">'Notes'</text>
  <text x="70" y="380" font-size="10" fill="#92400e">'PPTs'</text>
  <text x="70" y="395" font-size="10" fill="#92400e">'Projects'</text>
  
  <rect x="300" y="300" width="200" height="140" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
  <text x="400" y="325" text-anchor="middle" font-size="14" font-weight="bold" fill="#92400e">file_type</text>
  <line x1="320" y1="335" x2="480" y2="335" stroke="#92400e"/>
  <text x="320" y="350" font-size="10" fill="#92400e">'PDF'</text>
  <text x="320" y="365" font-size="10" fill="#92400e">'DOC'</text>
  <text x="320" y="380" font-size="10" fill="#92400e">'DOCX'</text>
  <text x="320" y="395" font-size="10" fill="#92400e">'PPT'</text>
  <text x="320" y="410" font-size="10" fill="#92400e">'PPTX'</text>
  <text x="320" y="425" font-size="10" fill="#92400e">'ZIP'</text>
  
  <!-- Storage Bucket -->
  <rect x="550" y="400" width="250" height="100" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="2" rx="10"/>
  <text x="675" y="425" text-anchor="middle" font-size="14" font-weight="bold" fill="#6b21a8">Storage Bucket</text>
  <line x1="570" y1="435" x2="780" y2="435" stroke="#6b21a8"/>
  <text x="570" y="450" font-size="10" fill="#6b21a8">Bucket: educational-resources</text>
  <text x="570" y="465" font-size="10" fill="#6b21a8">• PDF files</text>
  <text x="570" y="480" font-size="10" fill="#6b21a8">• Document files (DOC, DOCX)</text>
  <text x="570" y="495" font-size="10" fill="#6b21a8">• Presentation files (PPT, PPTX)</text>
  
  <!-- RLS Policies -->
  <rect x="50" y="500" width="450" height="120" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="10"/>
  <text x="275" y="525" text-anchor="middle" font-size="14" font-weight="bold" fill="#475569">Row Level Security (RLS) Policies</text>
  <line x1="70" y1="535" x2="480" y2="535" stroke="#475569"/>
  <text x="70" y="550" font-size="10" fill="#475569">profiles: Users can view/edit their own profile</text>
  <text x="70" y="565" font-size="10" fill="#475569">resources: Users can view all, edit/delete own resources</text>
  <text x="70" y="580" font-size="10" fill="#475569">Admin role: Full access to all tables</text>
  <text x="70" y="595" font-size="10" fill="#475569">Anonymous: Read-only access to public resources</text>
  
  <!-- Functions -->
  <rect x="550" y="550" width="400" height="100" fill="#fdf2f8" stroke="#ec4899" stroke-width="2" rx="10"/>
  <text x="750" y="575" text-anchor="middle" font-size="14" font-weight="bold" fill="#be185d">Database Functions</text>
  <line x1="570" y1="585" x2="930" y2="585" stroke="#be185d"/>
  <text x="570" y="600" font-size="10" fill="#be185d">handle_new_user(): Trigger on auth.users insert</text>
  <text x="570" y="615" font-size="10" fill="#be185d">increment_download_count(): Updates download statistics</text>
  <text x="570" y="630" font-size="10" fill="#be185d">get_user_statistics(): Admin dashboard analytics</text>
  
  <!-- Relationships -->
  <defs>
    <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
    </marker>
  </defs>
  
  <!-- auth.users to profiles -->
  <line x1="250" y1="155" x2="350" y2="155" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead3)"/>
  <text x="300" y="145" text-anchor="middle" font-size="9" fill="#374151">1:1</text>
  
  <!-- profiles to resources -->
  <line x1="550" y1="200" x2="650" y2="200" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead3)"/>
  <text x="600" y="190" text-anchor="middle" font-size="9" fill="#374151">1:N</text>
  
  <!-- resources to storage -->
  <line x1="790" y1="330" x2="675" y2="400" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead3)"/>
  <text x="730" y="365" text-anchor="middle" font-size="9" fill="#374151">stores files</text>
</svg>
```

### 4. User Flow Diagram

```svg
<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="900" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="600" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">User Flow Diagram</text>
  
  <!-- Start -->
  <circle cx="100" cy="100" r="30" fill="#22c55e" stroke="#166534" stroke-width="2"/>
  <text x="100" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="white">START</text>
  
  <!-- Landing Page -->
  <rect x="200" y="70" width="120" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="10"/>
  <text x="260" y="95" text-anchor="middle" font-size="12" fill="#1e40af">Landing Page</text>
  <text x="260" y="110" text-anchor="middle" font-size="10" fill="#1e40af">(Index)</text>
  
  <!-- Authentication Decision -->
  <polygon points="400,70 480,100 400,130 320,100" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-size="10" fill="#92400e">User</text>
  <text x="400" y="110" text-anchor="middle" font-size="10" fill="#92400e">Authenticated?</text>
  
  <!-- Sign In/Up -->
  <rect x="200" y="200" width="120" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="260" y="225" text-anchor="middle" font-size="12" fill="#991b1b">Sign In/Up</text>
  <text x="260" y="240" text-anchor="middle" font-size="10" fill="#991b1b">(Auth Page)</text>
  
  <!-- Browse Resources -->
  <rect x="550" y="70" width="120" height="60" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="10"/>
  <text x="610" y="95" text-anchor="middle" font-size="12" fill="#166534">Browse</text>
  <text x="610" y="110" text-anchor="middle" font-size="10" fill="#166534">Resources</text>
  
  <!-- Resource Actions -->
  <polygon points="750,70 830,100 750,130 670,100" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="750" y="95" text-anchor="middle" font-size="10" fill="#92400e">Select</text>
  <text x="750" y="110" text-anchor="middle" font-size="10" fill="#92400e">Action</text>
  
  <!-- Download Resource -->
  <rect x="900" y="40" width="120" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10"/>
  <text x="960" y="65" text-anchor="middle" font-size="12" fill="#0c4a6e">Download</text>
  <text x="960" y="80" text-anchor="middle" font-size="10" fill="#0c4a6e">Resource</text>
  
  <!-- Upload Resource -->
  <rect x="900" y="120" width="120" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="960" y="145" text-anchor="middle" font-size="12" fill="#166534">Upload</text>
  <text x="960" y="160" text-anchor="middle" font-size="10" fill="#166534">Resource</text>
  
  <!-- View Dashboard -->
  <rect x="750" y="200" width="120" height="60" fill="#fdf4ff" stroke="#a855f7" stroke-width="2" rx="10"/>
  <text x="810" y="225" text-anchor="middle" font-size="12" fill="#7c2d12">User</text>
  <text x="810" y="240" text-anchor="middle" font-size="10" fill="#7c2d12">Dashboard</text>
  
  <!-- Admin Check -->
  <polygon points="550,300 630,330 550,360 470,330" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="550" y="325" text-anchor="middle" font-size="10" fill="#92400e">Admin</text>
  <text x="550" y="340" text-anchor="middle" font-size="10" fill="#92400e">User?</text>
  
  <!-- Admin Dashboard -->
  <rect x="750" y="300" width="120" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="810" y="325" text-anchor="middle" font-size="12" fill="#991b1b">Admin</text>
  <text x="810" y="340" text-anchor="middle" font-size="10" fill="#991b1b">Dashboard</text>
  
  <!-- Upload Process -->
  <rect x="200" y="400" width="120" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="260" y="420" text-anchor="middle" font-size="11" fill="#166534">Select File</text>
  <text x="260" y="435" text-anchor="middle" font-size="11" fill="#166534">& Metadata</text>
  <text x="260" y="450" text-anchor="middle" font-size="9" fill="#166534">(Title, Category)</text>
  
  <rect x="400" y="400" width="120" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="460" y="420" text-anchor="middle" font-size="11" fill="#166534">Add Preview</text>
  <text x="460" y="435" text-anchor="middle" font-size="11" fill="#166534">Image</text>
  <text x="460" y="450" text-anchor="middle" font-size="9" fill="#166534">(Optional)</text>
  
  <rect x="600" y="400" width="120" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="660" y="420" text-anchor="middle" font-size="11" fill="#166534">Upload to</text>
  <text x="660" y="435" text-anchor="middle" font-size="11" fill="#166534">Supabase</text>
  <text x="660" y="450" text-anchor="middle" font-size="9" fill="#166534">Storage</text>
  
  <rect x="800" y="400" width="120" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="860" y="420" text-anchor="middle" font-size="11" fill="#166534">Save</text>
  <text x="860" y="435" text-anchor="middle" font-size="11" fill="#166534">Metadata</text>
  <text x="860" y="450" text-anchor="middle" font-size="9" fill="#166534">to Database</text>
  
  <!-- Search Flow -->
  <rect x="200" y="550" width="120" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10"/>
  <text x="260" y="575" text-anchor="middle" font-size="12" fill="#0c4a6e">Search/Filter</text>
  <text x="260" y="590" text-anchor="middle" font-size="10" fill="#0c4a6e">Resources</text>
  
  <rect x="400" y="550" width="120" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10"/>
  <text x="460" y="575" text-anchor="middle" font-size="12" fill="#0c4a6e">View Results</text>
  <text x="460" y="590" text-anchor="middle" font-size="10" fill="#0c4a6e">with Previews</text>
  
  <rect x="600" y="550" width="120" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10"/>
  <text x="660" y="575" text-anchor="middle" font-size="12" fill="#0c4a6e">Select &</text>
  <text x="660" y="590" text-anchor="middle" font-size="10" fill="#0c4a6e">Download</text>
  
  <!-- Admin Functions -->
  <rect x="200" y="700" width="140" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="270" y="720" text-anchor="middle" font-size="11" fill="#991b1b">View All Users</text>
  <text x="270" y="735" text-anchor="middle" font-size="11" fill="#991b1b">& Statistics</text>
  
  <rect x="380" y="700" width="140" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="450" y="720" text-anchor="middle" font-size="11" fill="#991b1b">Manage</text>
  <text x="450" y="735" text-anchor="middle" font-size="11" fill="#991b1b">Resources</text>
  
  <rect x="560" y="700" width="140" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="630" y="720" text-anchor="middle" font-size="11" fill="#991b1b">Platform</text>
  <text x="630" y="735" text-anchor="middle" font-size="11" fill="#991b1b">Analytics</text>
  
  <!-- Arrows -->
  <defs>
    <marker id="arrowhead4" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
    </marker>
  </defs>
  
  <!-- Flow arrows -->
  <line x1="130" y1="100" x2="200" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="320" y1="100" x2="320" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="480" y1="100" x2="550" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="670" y1="100" x2="670" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead4)"/>
  
  <!-- Labels for decision points -->
  <text x="400" y="60" text-anchor="middle" font-size="9" fill="#16a34a">Yes</text>
  <text x="350" y="150" text-anchor="middle" font-size="9" fill="#dc2626">No</text>
  <text x="850" y="60" text-anchor="middle" font-size="9" fill="#0284c7">Download</text>
  <text x="850" y="140" text-anchor="middle" font-size="9" fill="#22c55e">Upload</text>
  <text x="680" y="330" text-anchor="middle" font-size="9" fill="#dc2626">Yes</text>
  <text x="500" y="280" text-anchor="middle" font-size="9" fill="#6b7280">No</text>
  
  <!-- Flow connections -->
  <line x1="400" y1="130" x2="260" y2="200" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="830" y1="100" x2="900" y2="70" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="830" y1="100" x2="900" y2="150" stroke="#22c55e" stroke-width="2" marker-end="url(#arrowhead4)"/>
  <line x1="630" y1="330" x2="750" y2="330" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead4)"/>
  
  <!-- Upload process flow -->
  <line x1="260" y1="460" x2="400" y2="430" stroke="#22c55e" stroke-width="1" marker-end="url(#arrowhead4)"/>
  <line x1="520" y1="430" x2="600" y2="430" stroke="#22c55e" stroke-width="1" marker-end="url(#arrowhead4)"/>
  <line x1="720" y1="430" x2="800" y2="430" stroke="#22c55e" stroke-width="1" marker-end="url(#arrowhead4)"/>
  
  <!-- Search flow -->
  <line x1="320" y1="580" x2="400" y2="580" stroke="#0284c7" stroke-width="1" marker-end="url(#arrowhead4)"/>
  <line x1="520" y1="580" x2="600" y2="580" stroke="#0284c7" stroke-width="1" marker-end="url(#arrowhead4)"/>
  
  <!-- Admin flow -->
  <line x1="810" y1="360" x2="450" y2="700" stroke="#dc2626" stroke-width="1" marker-end="url(#arrowhead4)"/>
</svg>
```

### 5. Authentication Flow

```svg
<svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1000" height="700" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="500" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">Authentication & Authorization Flow</text>
  
  <!-- User -->
  <circle cx="100" cy="120" r="40" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="100" y="115" text-anchor="middle" font-size="12" fill="#1e40af">User</text>
  <text x="100" y="130" text-anchor="middle" font-size="10" fill="#1e40af">Client</text>
  
  <!-- React App -->
  <rect x="250" y="80" width="150" height="80" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" rx="10"/>
  <text x="325" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">React App</text>
  <text x="325" y="130" text-anchor="middle" font-size="10" fill="#166534">Frontend</text>
  <text x="325" y="145" text-anchor="middle" font-size="10" fill="#166534">(Auth Provider)</text>
  
  <!-- Supabase Auth -->
  <rect x="500" y="80" width="150" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
  <text x="575" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#92400e">Supabase</text>
  <text x="575" y="130" text-anchor="middle" font-size="10" fill="#92400e">Auth Service</text>
  <text x="575" y="145" text-anchor="middle" font-size="10" fill="#92400e">(JWT Tokens)</text>
  
  <!-- Database -->
  <rect x="750" y="80" width="150" height="80" fill="#fecaca" stroke="#dc2626" stroke-width="2" rx="10"/>
  <text x="825" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#991b1b">PostgreSQL</text>
  <text x="825" y="130" text-anchor="middle" font-size="10" fill="#991b1b">Database</text>
  <text x="825" y="145" text-anchor="middle" font-size="10" fill="#991b1b">(RLS Policies)</text>
  
  <!-- Authentication Steps -->
  <rect x="50" y="220" width="900" height="400" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" rx="5"/>
  <text x="500" y="245" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">Authentication Process</text>
  
  <!-- Step 1: Login Request -->
  <rect x="80" y="280" width="180" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="5"/>
  <text x="170" y="305" text-anchor="middle" font-size="12" font-weight="bold" fill="#0c4a6e">1. Login Request</text>
  <text x="170" y="320" text-anchor="middle" font-size="10" fill="#0c4a6e">Email & Password</text>
  
  <!-- Step 2: Validate Credentials -->
  <rect x="300" y="280" width="180" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="5"/>
  <text x="390" y="305" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">2. Validate</text>
  <text x="390" y="320" text-anchor="middle" font-size="10" fill="#92400e">Credentials</text>
  
  <!-- Step 3: Generate JWT -->
  <rect x="520" y="280" width="180" height="60" fill="#dcfce7" stroke="#16a34a" stroke-width="1" rx="5"/>
  <text x="610" y="305" text-anchor="middle" font-size="12" font-weight="bold" fill="#166534">3. Generate JWT</text>
  <text x="610" y="320" text-anchor="middle" font-size="10" fill="#166534">Access Token</text>
  
  <!-- Step 4: Store Session -->
  <rect x="740" y="280" width="180" height="60" fill="#f3e8ff" stroke="#8b5cf6" stroke-width="1" rx="5"/>
  <text x="830" y="305" text-anchor="middle" font-size="12" font-weight="bold" fill="#6b21a8">4. Store Session</text>
  <text x="830" y="320" text-anchor="middle" font-size="10" fill="#6b21a8">Browser Storage</text>
  
  <!-- Authorization Steps -->
  <rect x="80" y="380" width="180" height="60" fill="#fdf2f8" stroke="#ec4899" stroke-width="1" rx="5"/>
  <text x="170" y="405" text-anchor="middle" font-size="12" font-weight="bold" fill="#be185d">5. API Request</text>
  <text x="170" y="420" text-anchor="middle" font-size="10" fill="#be185d">With JWT Token</text>
  
  <rect x="300" y="380" width="180" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="5"/>
  <text x="390" y="405" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">6. Verify JWT</text>
  <text x="390" y="420" text-anchor="middle" font-size="10" fill="#92400e">Token Validation</text>
  
  <rect x="520" y="380" width="180" height="60" fill="#dcfce7" stroke="#16a34a" stroke-width="1" rx="5"/>
  <text x="610" y="405" text-anchor="middle" font-size="12" font-weight="bold" fill="#166534">7. Check RLS</text>
  <text x="610" y="420" text-anchor="middle" font-size="10" fill="#166534">Row Level Security</text>
  
  <rect x="740" y="380" width="180" height="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="5"/>
  <text x="830" y="405" text-anchor="middle" font-size="12" font-weight="bold" fill="#0c4a6e">8. Return Data</text>
  <text x="830" y="420" text-anchor="middle" font-size="10" fill="#0c4a6e">Authorized Data</text>
  
  <!-- RLS Policies Detail -->
  <rect x="80" y="480" width="840" height="120" fill="#f1f5f9" stroke="#64748b" stroke-width="1" rx="5"/>
  <text x="500" y="505" text-anchor="middle" font-size="14" font-weight="bold" fill="#475569">Row Level Security (RLS) Policies</text>
  
  <rect x="100" y="520" width="180" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" rx="3"/>
  <text x="190" y="545" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e40af">User Role</text>
  <text x="190" y="560" text-anchor="middle" font-size="9" fill="#1e40af">Own resources only</text>
  
  <rect x="300" y="520" width="180" height="60" fill="#fecaca" stroke="#dc2626" stroke-width="1" rx="3"/>
  <text x="390" y="545" text-anchor="middle" font-size="11" font-weight="bold" fill="#991b1b">Admin Role</text>
  <text x="390" y="560" text-anchor="middle" font-size="9" fill="#991b1b">All resources</text>
  
  <rect x="500" y="520" width="180" height="60" fill="#f0fdf4" stroke="#22c55e" stroke-width="1" rx="3"/>
  <text x="590" y="545" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">Public Read</text>
  <text x="590" y="560" text-anchor="middle" font-size="9" fill="#166534">Browse resources</text>
  
  <rect x="700" y="520" width="180" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="3"/>
  <text x="790" y="545" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e">Download Auth</text>
  <text x="790" y="560" text-anchor="middle" font-size="9" fill="#92400e">Login required</text>
  
  <!-- Arrows -->
  <defs>
    <marker id="arrowhead5" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
    </marker>
  </defs>
  
  <!-- Main flow arrows -->
  <line x1="140" y1="120" x2="250" y2="120" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead5)"/>
  <line x1="400" y1="120" x2="500" y2="120" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead5)"/>
  <line x1="650" y1="120" x2="750" y2="120" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead5)"/>
  
  <!-- Step arrows -->
  <line x1="260" y1="310" x2="300" y2="310" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
  <line x1="480" y1="310" x2="520" y2="310" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
  <line x1="700" y1="310" x2="740" y2="310" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
  
  <line x1="260" y1="410" x2="300" y2="410" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
  <line x1="480" y1="410" x2="520" y2="410" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
  <line x1="700" y1="410" x2="740" y2="410" stroke="#374151" stroke-width="1" marker-end="url(#arrowhead5)"/>
</svg>
```

## File Structure
```
src/
├── components/
│   ├── ui/               # Shadcn/UI components
│   ├── Navbar.tsx        # Navigation component
│   └── CategoryCard.tsx  # Resource category display
├── pages/
│   ├── Index.tsx         # Landing page
│   ├── Auth.tsx          # Authentication page
│   ├── Resources.tsx     # Browse resources
│   ├── Upload.tsx        # Upload resources
│   ├── Dashboard.tsx     # User dashboard
│   ├── Admin.tsx         # Admin panel
│   └── About.tsx         # About page
├── hooks/
│   └── useAuth.tsx       # Authentication hook
├── integrations/
│   └── supabase/         # Supabase configuration
├── lib/
│   └── utils.ts          # Utility functions
└── App.tsx               # Main application component
```

## Security Features
- Row Level Security (RLS) policies
- JWT token-based authentication
- Role-based access control (User/Admin)
- Secure file upload validation
- Protected routes and components

## Performance Optimizations
- React Query for data caching
- Lazy loading of components
- Optimized image handling
- Efficient database queries
- CDN for static assets

## Deployment Architecture
- Frontend: Deployed on Lovable platform
- Backend: Supabase (managed PostgreSQL + Auth + Storage)
- CDN: Automatic asset optimization
- SSL: Enabled by default

## Monitoring & Analytics
- Real-time user activity tracking
- Resource download statistics
- Admin dashboard with analytics
- Error tracking and logging
- Performance monitoring
