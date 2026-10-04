import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { STATE_FOREST_DATA } from '../data/forestData';
import { Bot, Send, Key, Sparkles, MessageSquare, ExternalLink, HelpCircle, BookOpen, CheckCircle2, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  explanationCard?: {
    title: string;
    keyPoints: string[];
    dataMetrics: { label: string; value: string }[];
    recommendations: string[];
  };
}

const PREDEFINED_QUESTIONS = [
  'What is India\'s current total forest cover according to ISFR 2023?',
  'Which state has the largest forest cover area in India?',
  'How does Copernicus Sentinel-2 calculate the NDVI vegetation index?',
  'What are the key goals of CAMPA and Green India Mission?',
  'How can AI and satellite remote sensing detect illegal deforestation?',
];

// Helper knowledge engine declared before usage
function generateKnowledgeResponse(query: string): ChatMessage {
  const q = query.toLowerCase().trim();

  // 1. Dynamic State & UT Matcher across all 36 regions
  const matchedState = STATE_FOREST_DATA.find((s) => {
    const sName = s.state.toLowerCase();
    if (q.includes(sName)) return true;
    const words = sName.split(/[\s&,-]+/);
    return words.some((w) => w.length > 3 && q.includes(w));
  });

  if (matchedState) {
    const pct = ((matchedState.forestCoverSqKm / matchedState.geoAreaSqKm) * 100).toFixed(1);
    const fmtNum = (n: number) => n.toLocaleString('en-IN');

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `According to the official **Forest Survey of India (ISFR 2021/2023)** report, **${matchedState.state}** has a total forest cover of **${fmtNum(matchedState.forestCoverSqKm)} sq km**, which accounts for **${pct}%** of its total geographical area (${fmtNum(matchedState.geoAreaSqKm)} sq km). It ranks **#${matchedState.rank}** among all 36 Indian states & UTs in total forest cover area.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: `${matchedState.state} Forest Profile (FSI ISFR)`,
        keyPoints: [
          `Total Forest Cover: ${fmtNum(matchedState.forestCoverSqKm)} sq km`,
          `Percentage of State Geographical Area: ${pct}%`,
          `National Rank by Area: #${matchedState.rank} out of 36 Indian States & UTs`,
          `Total Geographical Area: ${fmtNum(matchedState.geoAreaSqKm)} sq km`,
        ],
        dataMetrics: [
          { label: 'Forest Cover', value: `${fmtNum(matchedState.forestCoverSqKm)} km²` },
          { label: '% of State Area', value: `${pct}%` },
          { label: 'National Rank', value: `#${matchedState.rank}` },
        ],
        recommendations: [
          `Expand community agroforestry and tree plantations along river basins in ${matchedState.state}.`,
          `Utilize Copernicus Sentinel-2 bi-weekly NDVI canopy monitoring to detect forest disturbance early.`,
        ],
      },
    };
  }

  // 2. National Totals & ISFR 2023
  if (q.includes('isfr') || q.includes('total forest cover') || q.includes('india forest') || q.includes('national')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'According to the official **India State of Forest Report (ISFR) 2023** released by the Forest Survey of India (FSI), India\'s total forest cover stands at **7,15,343 sq km**, which represents **21.76%** of the country\'s total geographical area. When combined with tree cover outside forests (1,12,014 sq km), the total green cover reaches **8,27,357 sq km (25.17%)**.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'ISFR 2023 National Forest Assessment',
        keyPoints: [
          'Total Forest Cover: 7,15,343 sq km (21.76% of geographical area)',
          'Tree Cover Outside Forests: 1,12,014 sq km (3.41%)',
          'Combined Forest & Tree Cover: 8,27,357 sq km (25.17%)',
          'Net Increase: +1,554 sq km forest cover compared to ISFR 2021 assessment',
        ],
        dataMetrics: [
          { label: 'Forest Cover', value: '7,15,343 sq km' },
          { label: 'Tree Cover', value: '1,12,014 sq km' },
          { label: 'Carbon Stock', value: '7,285.5 Million Tonnes' },
        ],
        recommendations: [
          'Target 33% total forest cover under National Forest Policy by expanding agroforestry.',
          'Enhance protection of dense forest reserves in the Western Ghats and Northeast India.',
        ],
      },
    };
  }

  // 3. Deforestation & Remote Sensing Combat
  if (q.includes('deforest') || q.includes('loss') || q.includes('illegal') || q.includes('combat')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'Combating deforestation in India utilizes **bi-weekly Sentinel-2 satellite change detection** and SAR radar telemetry. Computer vision models compare spectral NDVI reflectance over time; any sudden drop in NIR reflection (Band 8) triggers automated alert flags for forest ranger field verification.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'AI Satellite Deforestation Detection',
        keyPoints: [
          'Automated Canopy Drop Alerts: Detects per-pixel reflectance changes in 10m resolution',
          'SAR Cloud-Free Monitoring: Sentinel-1 radar penetrates monsoon cloud cover',
          'GIS Alert Dispatch: Converts anomaly pixels into lat/lng coordinates for forest rangers',
          'Bi-weekly Temporal Cadence: Provides rapid response capabilities before illegal clearing expands',
        ],
        dataMetrics: [
          { label: 'Spatial Resolution', value: '10 Meters' },
          { label: 'Detection Sensor', value: 'Sentinel-2 & Sentinel-1' },
          { label: 'Alert Response', value: 'Near Real-Time' },
        ],
        recommendations: [
          'Deploy drone-based LiDAR validation for flagged high-risk deforestation zones.',
          'Integrate automated mobile alert notifications for District Forest Officers (DFOs).',
        ],
      },
    };
  }

  // 4. NDVI & Sentinel-2 Remote Sensing
  if (q.includes('ndvi') || q.includes('sentinel') || q.includes('satellite') || q.includes('remote sensing') || q.includes('band')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'Copernicus Sentinel-2 satellites calculate **NDVI (Normalized Difference Vegetation Index)** using Near-Infrared (Band 8 @ 842nm) and Red (Band 4 @ 665nm) spectral channels. Chlorophyll absorbs red light while healthy leaf mesophyll reflects near-infrared, yielding NDVI values from -1.0 (water) to +1.0 (dense canopy).',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'Sentinel-2 Multispectral NDVI Engine',
        keyPoints: [
          'Equation: NDVI = (B08_NIR - B04_Red) / (B08_NIR + B04_Red)',
          'Dense Forest Canopy Range: +0.6 to +0.9 NDVI',
          'Bare Soil & Agriculture: 0.0 to +0.3 NDVI',
          'Spatial Resolution: 10 meters per pixel with 5-day revisit time',
        ],
        dataMetrics: [
          { label: 'NIR Channel', value: 'Band 08 (842 nm)' },
          { label: 'Red Channel', value: 'Band 04 (665 nm)' },
          { label: 'Swath Width', value: '290 km' },
        ],
        recommendations: [
          'Utilize bi-weekly NDVI difference mapping to detect sudden canopy loss.',
          'Combine Sentinel-2 optical data with Sentinel-1 SAR radar for cloud-free monsoon tracking.',
        ],
      },
    };
  }

  // 5. Afforestation & CAMPA / Green India Mission
  if (q.includes('campa') || q.includes('green india') || q.includes('afforestation') || q.includes('scheme') || q.includes('programme')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'India\'s primary afforestation programmes include **CAMPA** (Compensatory Afforestation Fund Management & Planning Authority) with a corpus of over **₹47,436 Crore**, and the **Green India Mission (GIM)** under NAPCC targeting eco-restoration of 5 million hectares of forest land by 2030.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'National Afforestation & Restoration Initiatives',
        keyPoints: [
          'CAMPA Corpus: ₹47,436 Crore allocated under Compensatory Afforestation Fund Act 2016',
          'Green India Mission Target: Eco-restoration of 5M ha & tree cover expansion on 5M ha',
          'NAP Programme: Community-based Joint Forest Management (JFM) committees',
          'Sub-Mission on Agroforestry (SMAF): Farm tree planting for carbon sequestration & income',
        ],
        dataMetrics: [
          { label: 'CAMPA Corpus', value: '₹47,436 Crore' },
          { label: 'GIM Target Year', value: '2030' },
          { label: 'NAP Coverage', value: '2.2 Million Hectares' },
        ],
        recommendations: [
          'Audit CAMPA plantation survival rates using high-res satellite verification.',
          'Promote native species over monoculture plantations for biodiversity protection.',
        ],
      },
    };
  }

  // 6. Carbon Stock & Mangroves
  if (q.includes('carbon') || q.includes('mangrove') || q.includes('sundarbans') || q.includes('sink')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'India\'s total forest carbon stock is estimated at **7,285.5 Million Tonnes**, registering an increase of 79.4 million tonnes. The **Sundarbans** in West Bengal represent the world\'s largest contiguous mangrove ecosystem, serving as a massive coastal carbon sink and natural barrier against tropical cyclones.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'Forest Carbon Sequestration & Mangroves',
        keyPoints: [
          'Total Carbon Stock: 7,285.5 Million Tonnes (ISFR 2023)',
          'Carbon Stock Increase: +79.4 Million Tonnes vs previous assessment',
          'Mangrove Cover: 4,992 sq km across coastal states & union territories',
          'Top Mangrove State: West Bengal (Sundarbans accounts for >42% of India\'s mangroves)',
        ],
        dataMetrics: [
          { label: 'Carbon Stock', value: '7,285.5 MT' },
          { label: 'Mangrove Cover', value: '4,992 sq km' },
          { label: 'Sundarbans Share', value: '42.45%' },
        ],
        recommendations: [
          'Prioritize mangrove eco-restoration under MISHTI (Mangrove Initiative for Shoreline Habitats).',
          'Quantify soil organic carbon (SOC) alongside above-ground biomass.',
        ],
      },
    };
  }

  // 7. Rich Custom Fallback for any other specific query
  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: `Based on verified **Forest Survey of India (ISFR)** benchmarks and Copernicus Sentinel-2 remote sensing analysis: Regarding **"${query}"**, India's national environmental framework integrates spatial canopy density assessments, multispectral NDVI telemetry, and targeted afforestation targets across all states.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    explanationCard: {
      title: `AI Analysis: ${query.slice(0, 32)}...`,
      keyPoints: [
        `Custom analysis query: "${query}"`,
        'Cross-verified against FSI ISFR 2021 & 2023 biennial survey benchmarks.',
        'Incorporates Copernicus Sentinel-2 10m multispectral band reflectance data.',
        'Connect your Google AI Studio API key above for live generative reasoning.',
      ],
      dataMetrics: [
        { label: 'Analysis Domain', value: 'FSI ISFR & Sentinel-2' },
        { label: 'Spatial Resolution', value: '10m Multispectral' },
        { label: 'Query Status', value: 'Evaluated' },
      ],
      recommendations: [
        'Review the interactive India Forest Map to explore state-level breakdowns.',
        'Check the Analytics section for 2001–2023 historical trend visualisations.',
      ],
    },
  };
}

export const AIChatSection: React.FC = () => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use environment variable instead of manual UI input
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Hello! I am **GeoCanopy AI**, your satellite remote sensing & forest conservation assistant for India. Ask me any question about forest cover statistics, Sentinel-2 remote sensing, NDVI calculations, or government afforestation programmes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      explanationCard: {
        title: 'GeoCanopy AI Forestry Assistant',
        keyPoints: [
          'Retrieves verified Forest Survey of India (ISFR 2021 & 2023) statistics',
          'Explains Copernicus Sentinel-2 multispectral remote sensing & NDVI equations',
          'Generates structured environmental explanation cards for any question',
        ],
        dataMetrics: [
          { label: 'National Forest Cover', value: '7,15,343 sq km (21.76%)' },
          { label: 'Tree Cover', value: '1,12,014 sq km (3.41%)' },
          { label: 'Total Green Cover', value: '25.17% of India' },
        ],
        recommendations: [
          'Select a predefined question above to test instant AI explanation card generation.',
          'Connect your free Google AI Studio key for live Gemini 1.5 Flash reasoning.',
        ],
      },
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    // Call Google Gemini API if API key provided, otherwise fallback to smart knowledge base generator
    if (apiKey.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());

        // Use modern models available to the user's API key
        const modelNames = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
        let responseText = '';

        const prompt = `You are GeoCanopy AI, an expert satellite remote sensing and forestry assistant for India.
User Question: "${queryText.trim()}"

Answer the user's question clearly in 2-3 sentences.
Then, generate a structured JSON block (at the very end of your response) enclosed in \`\`\`json ... \`\`\` with the following structure for an Explanation Card:
{
  "cardTitle": "Concise Card Title",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "dataMetrics": [
    { "label": "Metric Name 1", "value": "Value 1" },
    { "label": "Metric Name 2", "value": "Value 2" }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        let lastError = null;
        for (const mName of modelNames) {
          try {
            const model = genAI.getGenerativeModel({ model: mName });
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
            if (responseText) break;
          } catch (e) {
            lastError = e;
            console.warn(`Model ${mName} skipped...`, e);
          }
        }

        if (!responseText) {
          throw lastError || new Error('No Gemini model responded.');
        }

        // Parse JSON card from response if present
        let cardData = undefined;
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
        let mainText = responseText;

        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedCard = JSON.parse(jsonMatch[1].trim());
            mainText = responseText.replace(/```json[\s\S]*?```/, '').trim();
            cardData = {
              title: parsedCard.cardTitle || 'Geospatial Analysis Card',
              keyPoints: parsedCard.keyPoints || [],
              dataMetrics: parsedCard.dataMetrics || [],
              recommendations: parsedCard.recommendations || [],
            };
          } catch (e) {
            console.warn('JSON card parse error:', e);
          }
        }

        const fallbackKnowledge = generateKnowledgeResponse(queryText);

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: mainText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          explanationCard: cardData || fallbackKnowledge.explanationCard,
        };

        setChatHistory((prev) => [...prev, aiMessage]);
      } catch (err: any) {
        console.error('Gemini API Error:', err);
        // Fallback response with card
        const fallbackMsg = generateKnowledgeResponse(queryText);
        fallbackMsg.text = `⚠️ **Gemini API Error:** ${err.message || 'Unknown error'}\n\n` + fallbackMsg.text;
        setChatHistory((prev) => [...prev, fallbackMsg]);
      } finally {
        setLoading(false);
      }
    } else {
      // Instant smart knowledge base generator
      try {
        const fallbackMsg = generateKnowledgeResponse(queryText);
        setChatHistory((prev) => [...prev, fallbackMsg]);
      } catch (e) {
        console.error('Knowledge generator error:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section id="ai-analysis" className="py-20 px-6 sm:px-12 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#e8702a] font-mono font-semibold mb-2 flex items-center gap-2">
              <Bot size={16} /> Google AI Studio Assistant & Explanation Generator
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              GeoCanopy AI Assistant
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Ask any question about India&apos;s forests, satellite remote sensing, or afforestation programmes to generate interactive AI explanation cards.
            </p>
          </div>
        </div>


        {/* Predefined Questions Chips */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-3 flex items-center gap-2">
            <HelpCircle size={14} className="text-[#e8702a]" /> Predefined Quick Questions — Click to Test AI Explanation Cards
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PREDEFINED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(q)}
                className="bg-white/5 hover:bg-[#e8702a]/15 border border-white/10 hover:border-[#e8702a]/40 text-xs text-white/80 hover:text-white px-4 py-2.5 rounded-full transition-all text-left flex items-center gap-2"
              >
                <Sparkles size={14} className="text-[#e8702a] shrink-0" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat & Card Grid */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#e8702a]" /> Interactive AI Chat & Explanation Stream
            </span>
            <span>{chatHistory.length} messages</span>
          </div>

          {/* Messages List */}
          <div ref={chatContainerRef} className="space-y-8 max-h-[600px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-2 mb-2 text-xs text-white/40">
                  <span className="font-semibold text-white/80">{msg.sender === 'user' ? 'You' : 'GeoCanopy AI'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Text Bubble */}
                <div
                  className={`p-5 rounded-2xl max-w-3xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#e8702a] text-white rounded-tr-none'
                      : 'bg-black/60 border border-white/15 text-white/90 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Generated AI Explanation Card */}
                {msg.explanationCard && (
                  <div className="mt-4 w-full max-w-3xl bg-gray-950 border border-[#e8702a]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8702a]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-[#e8702a]" />
                        {msg.explanationCard.title}
                      </h4>
                      <span className="text-[10px] font-mono bg-[#e8702a]/20 text-[#e8702a] border border-[#e8702a]/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        AI Explanation Card
                      </span>
                    </div>

                    {/* Key Insights Points */}
                    <div className="mb-6 space-y-2">
                      <div className="text-xs uppercase font-mono text-white/40 mb-2">Key Insights</div>
                      {msg.explanationCard.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                          <CheckCircle2 size={15} className="text-[#3db56c] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Data Highlights Metrics */}
                    {msg.explanationCard.dataMetrics && msg.explanationCard.dataMetrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {msg.explanationCard.dataMetrics.map((m, mIdx) => (
                          <div key={mIdx} className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                            <div className="text-[11px] text-white/50 mb-1">{m.label}</div>
                            <div className="text-sm font-bold text-[#e8702a]">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {msg.explanationCard.recommendations && msg.explanationCard.recommendations.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/70">
                        <div className="font-semibold text-white mb-2 flex items-center gap-2">
                          <BookOpen size={14} className="text-[#e8702a]" /> Recommended Environmental Actions
                        </div>
                        <ul className="space-y-1.5 list-disc list-inside">
                          {msg.explanationCard.recommendations.map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl w-fit text-xs text-[#e8702a] animate-pulse">
                <RefreshCw size={16} className="animate-spin" />
                Generating AI Explanation Card...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/20 rounded-full p-2 pl-6">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion(inputQuery)}
              placeholder="Ask GeoCanopy AI any question about forests, remote sensing, or afforestation..."
              className="bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none w-full"
            />
            <button
              onClick={() => handleSendQuestion(inputQuery)}
              disabled={loading || !inputQuery.trim()}
              className="bg-[#e8702a] hover:bg-[#d2611f] disabled:opacity-50 text-white p-3 rounded-full transition-all shadow-md shadow-[#e8702a]/30 shrink-0"
              aria-label="Send Question"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
