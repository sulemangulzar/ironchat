import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 text-slate-100">
      <nav className="flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tight gradient-text">⚡ IronChat</div>
        <div className="flex gap-4">
          {!isLoading && user ? (
            <Link to="/chat" className="px-6 py-2.5 rounded-full font-medium gradient-bg text-white shadow-lg">Go to Chat</Link>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2.5 rounded-full font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">Log in</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-full font-medium gradient-bg text-white shadow-lg hover:shadow-indigo-500/25">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 p-8 max-w-7xl mx-auto w-full">
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            The next generation of <br />
            <span className="gradient-text">AI conversations</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            IronChat is your intelligent, extremely fast, and highly capable AI assistant. 
            Brainstorm ideas, write code, or just have a chat.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link to={user ? "/chat" : "/signup"} className="px-8 py-4 rounded-full text-lg font-bold gradient-bg text-white shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              {user ? "Continue Chatting" : "Get Started for Free"}
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center perspective-[1000px]">
          <div className="w-full max-w-md p-8 flex flex-col gap-6 glass-panel transform -rotate-y-12 rotate-x-12 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out shadow-2xl">
            
            <div className="flex gap-4 items-end">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl shrink-0">⚡</div>
              <div className="bg-slate-700 px-5 py-4 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed shadow-md">
                Hello! I'm IronChat. How can I help you today?
              </div>
            </div>

            <div className="flex gap-4 items-end justify-end">
              <div className="bg-indigo-600 text-white px-5 py-4 rounded-2xl rounded-br-sm text-[15px] leading-relaxed shadow-md">
                Can you help me write a Python script?
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl shrink-0">👤</div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl shrink-0">⚡</div>
              <div className="bg-slate-700 px-5 py-4 rounded-2xl rounded-bl-sm shadow-md typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
