import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, uploadAvatar, requestBusinessVerification } from "../services/profileService";
import { useToast } from "../components/common/ToastProvider";

function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", company: "", avatar: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  // Verification modal state
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [verifForm, setVerifForm] = useState({ gst_number: "", pan_number: "", company_address: "", documents: [] });
  const [verifSubmitting, setVerifSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile) {
        setForm({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          company: profile.company_name || "",
          avatar: null,
        });
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile]);

  const showToast = (msg) => {
    toast.success(msg);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      let avatarUrl = profile?.avatar_url || null;
      if (form.avatar) {
        avatarUrl = await uploadAvatar(form.avatar, user.id);
      }

      const payload = {
        full_name: form.full_name,
        phone: form.phone || null,
        company_name: form.company || null,
        avatar_url: avatarUrl,
      };

      await updateProfile(user.id, payload);
      await refreshProfile();
      showToast("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const openVerification = () => {
    setVerifForm({ gst_number: profile?.gst_number || "", pan_number: profile?.pan_number || "", company_address: profile?.company_address || "", documents: [] });
    setShowVerifModal(true);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setVerifSubmitting(true);
    try {
      await requestBusinessVerification(user.id, {
        gst_number: verifForm.gst_number,
        pan_number: verifForm.pan_number,
        company_address: verifForm.company_address,
        documents: verifForm.documents,
      });
      await refreshProfile();
      toast.success('Verification request submitted.');
      setShowVerifModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to submit verification request.');
    } finally {
      setVerifSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="content-card">
        <div style={{display:"flex",gap:20}}>
          <div style={{width:120,height:120,background:"#f3f3f3",borderRadius:8}} />
          <div style={{flex:1}}>
            <div style={{height:24,background:"#f3f3f3",width:"40%",marginBottom:8}} />
            <div style={{height:12,background:"#f3f3f3",width:"60%",marginBottom:8}} />
            <div style={{height:12,background:"#f3f3f3",width:"80%"}} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-card">
        <div style={{padding:"var(--sp-6)",color:"var(--text-muted)"}}>Please log in to manage your profile.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Profile</h1>
            <p>Manage your personal and company information</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Your Profile</div>
            <div className="content-card__sub">Update details shown across the dashboard</div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:20,alignItems:"start"}}>
          <div>
            <div style={{width:140,height:140,borderRadius:8,overflow:"hidden",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              ) : (
                <div style={{fontSize:28,fontWeight:700,color:"var(--text-muted)"}}>{(profile?.full_name||"?")[0]}</div>
              )}
            </div>
            <div style={{marginTop:12}}>
              <input type="file" accept="image/*" onChange={e => setForm({...form, avatar: e.target.files[0] || null})} />
            </div>
          </div>

          <div>
            {error && <div className="auth-error" style={{marginBottom:12}}>{error}</div>}
            <div style={{display:"grid",gap:12}}>
              <div className="auth-field">
                <label className="input-label">Full name</label>
                <input className="input" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
              </div>

              <div className="auth-field">
                <label className="input-label">Email</label>
                <input className="input" value={profile?.email || ""} disabled />
              </div>

              <div className="auth-field">
                <label className="input-label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>

              <div className="auth-field">
                <label className="input-label">Company</label>
                <input className="input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
              </div>

              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                <div style={{marginLeft:"auto",color:"var(--text-muted)",display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                  <div><strong>Account:</strong> {profile?.role}</div>
                  <div><strong>Verification:</strong> {profile?.verification_status || 'Not Verified'}</div>
                  {profile?.role === 'business' && (
                    profile?.verification_status === 'Verified' ? (
                      <div><span className="status-badge status-badge--verified">Verified</span></div>
                    ) : profile?.verification_status === 'Pending' ? (
                      <div><button className="btn btn-ghost btn-sm" disabled>Pending Review</button></div>
                    ) : (
                      <div><button type="button" className="btn btn-primary btn-sm" onClick={openVerification}>Request Verification</button></div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showVerifModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}
          onClick={() => setShowVerifModal(false)}>
          <div className="content-card animate-fade-up" style={{width:560,maxWidth:"95vw",margin:0}} onClick={e => e.stopPropagation()}>
            <div className="content-card__header">
              <div className="content-card__title">Business Verification Request</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowVerifModal(false)}>✕</button>
            </div>
            <form onSubmit={handleVerificationSubmit}>
              <div style={{display:'grid',gap:12}}>
                <div className="auth-field">
                  <label className="input-label">GST Number</label>
                  <input className="input" value={verifForm.gst_number} onChange={e => setVerifForm({...verifForm, gst_number: e.target.value})} placeholder="GSTIN" />
                </div>
                <div className="auth-field">
                  <label className="input-label">PAN Number</label>
                  <input className="input" value={verifForm.pan_number} onChange={e => setVerifForm({...verifForm, pan_number: e.target.value})} placeholder="PAN" />
                </div>
                <div className="auth-field">
                  <label className="input-label">Company Address</label>
                  <textarea className="input" rows={3} value={verifForm.company_address} onChange={e => setVerifForm({...verifForm, company_address: e.target.value})} />
                </div>
                <div className="auth-field">
                  <label className="input-label">Upload Documents</label>
                  <input type="file" className="input" multiple onChange={e => setVerifForm({...verifForm, documents: Array.from(e.target.files || [])})} />
                  <p style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>Upload company registration, PAN card, GST certificate, or other supporting docs.</p>
                </div>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <button className="btn btn-primary" type="submit" disabled={verifSubmitting}>{verifSubmitting ? 'Submitting...' : 'Submit Verification Request'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowVerifModal(false)}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
