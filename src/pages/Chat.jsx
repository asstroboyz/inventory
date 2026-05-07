import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  HiChatAlt2, HiLightningBolt, HiUsers, HiHashtag, HiShoppingCart,
  HiSearch, HiVideoCamera, HiInformationCircle, HiPlus, HiPaperAirplane,
  HiCube, HiCheckCircle, HiClock, HiDotsHorizontal, HiUser, HiX, HiHome, HiArrowLeft
} from 'react-icons/hi'
import { UserHelper } from '../helper/user'
import { BaseUrl } from '../helper/api'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Chat = () => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Sidebar Kiri
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false) // Sidebar Kanan (Propose)
  const [activeTab, setActiveTab] = useState('inventory')
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  // Propose Items State
  const [items, setItems] = useState([])
  const [searchItem, setSearchItem] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isSearchingItems, setIsSearchingItems] = useState(false)

  // Manual Item State
  const [manualItem, setManualItem] = useState({ nama: '', merk: '' })

  // Create Group State
  const [isGroupMode, setIsGroupMode] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  const user = UserHelper.getUser()
  const currentUserId = user?.id || user?.ID
  const messagesEndRef = useRef(null)

  const canCreateGroup = parseInt(user?.otoritas_id) !== 6
  useEffect(() => {
    if (activeRoom && window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [activeRoom])

  useEffect(() => {
    fetchRooms()
    fetchUsers()

    // Poll for new rooms every 5 seconds
    const interval = setInterval(() => {
      fetchRooms()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Search items when tab or search term changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [activeTab, searchItem])

  // Auto-polling for real-time feel
  useEffect(() => {
    let interval;
    if (activeRoom) {
      fetchMessages(activeRoom.id || activeRoom.ID)
      interval = setInterval(() => {
        fetchMessages(activeRoom.id || activeRoom.ID)
      }, 3000) // Check for new messages every 3 seconds
    }
    return () => clearInterval(interval)
  }, [activeRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/chat/rooms`, UserHelper.axiosConfig())
      const roomData = res.data.data || []
      setRooms(roomData)

      // Gunakan functional update agar tidak terkena stale closure saat polling
      setActiveRoom(prev => {
        if (!prev && roomData.length > 0) {
          return roomData[0]
        }
        return prev
      })
    } catch (err) {
      console.error("Gagal mengambil room", err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/user/`, UserHelper.axiosConfig())
      const otherUsers = res.data.data?.filter(u => (u.id || u.ID) !== currentUserId) || []
      setUsers(otherUsers)
    } catch (err) {
      console.error("Gagal mengambil user", err)
    }
  }

  const fetchItems = async () => {
    setIsSearchingItems(true)
    try {
      const endpoint = activeTab === 'inventory'
        ? `${BaseUrl}/api/record/barang/cari`
        : `${BaseUrl}/api/master/barang/cari`

      const payload = {
        search: searchItem || null,
        limit: "20",
        page: "1"
      }

      const res = await axios.post(endpoint, payload, UserHelper.axiosConfig())
      setItems(res.data.data || [])
    } catch (err) {
      console.error("Gagal mencari barang", err)
    } finally {
      setIsSearchingItems(false)
    }
  }

  const fetchMessages = async (roomId) => {
    if (!roomId) return
    try {
      const res = await axios.get(`${BaseUrl}/api/chat/rooms/${roomId}/messages`, UserHelper.axiosConfig())
      const newMessages = res.data.data?.reverse() || []
      setMessages(newMessages)
    } catch (err) {
      console.error("Gagal mengambil pesan", err)
    }
  }

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault()
    if (!newMessage.trim() || !activeRoom) return

    const tempMsg = newMessage
    const roomId = activeRoom.id || activeRoom.ID
    setNewMessage('') // Clear input early for better UX

    try {
      const payload = {
        room_id: roomId,
        message: tempMsg,
        chat_message_type_id: 1 // Text
      }
      await axios.post(`${BaseUrl}/api/chat/messages`, payload, UserHelper.axiosConfig())
      fetchMessages(roomId) // Refresh immediately
    } catch (err) {
      setNewMessage(tempMsg) // Restore on error
      toast.error("Gagal mengirim pesan")
    }
  }

  const handleProposeItem = async () => {
    if (!activeRoom) return

    let itemName = ''
    let itemCode = ''
    let payload = {
      room_id: activeRoom.id || activeRoom.ID,
      chat_message_type_id: 3, // Cart / Transaction Type
    }

    if (activeTab === 'manual') {
      if (!manualItem.nama) {
        toast.error("Nama barang harus diisi")
        return
      }
      itemName = manualItem.nama
      itemCode = manualItem.merk ? `Merk: ${manualItem.merk}` : 'Manual Input'
      payload.message = `PROPOSAL (MANUAL): ${itemName} ${manualItem.merk ? `[${manualItem.merk}]` : ''}`
      payload.reference_id = null
      payload.reference_type = 'manual'
    } else {
      if (!selectedItem) {
        toast.error("Pilih barang terlebih dahulu")
        return
      }
      itemName = selectedItem.master_barang?.nama_brg || selectedItem.nama_brg
      itemCode = selectedItem.master_barang?.kode_brg || selectedItem.kode_brg
      payload.message = `PROPOSAL: ${itemName} (${itemCode})`
      payload.reference_id = selectedItem.id || selectedItem.ID
      payload.reference_type = activeTab // 'inventory' or 'assets'
    }

    try {
      await axios.post(`${BaseUrl}/api/chat/messages`, payload, UserHelper.axiosConfig())
      toast.success("Usulan berhasil dikirim")
      setSelectedItem(null)
      setManualItem({ nama: '', merk: '' })
      if (window.innerWidth < 1024) setIsRightSidebarOpen(false)
      fetchMessages(activeRoom.id || activeRoom.ID)
    } catch (err) {
      toast.error("Gagal mengirim usulan")
    }
  }

  const handleApproveProposal = async (msg) => {
    if (user?.otoritas_id > 3) {
      toast.error("Hanya Admin/Pimpinan yang bisa menyetujui")
      return
    }

    try {
      const payload = {
        room_id: msg.room_id,
        user_id: currentUserId,
        item_id: msg.reference_id,
        item_type: msg.reference_type
      }
      await axios.post(`${BaseUrl}/api/chat/cart`, payload, UserHelper.axiosConfig())
      toast.success("Barang disetujui & masuk ke troli!")
      fetchMessages(activeRoom.id || activeRoom.ID) // Refresh to update status if needed
    } catch (err) {
      toast.error("Gagal menyetujui usulan")
    }
  }

  const startPrivateChat = async (targetUser) => {
    const targetId = targetUser.id || targetUser.ID
    try {
      const payload = {
        chat_room_type_id: 1, // Private
        user_ids: [targetId]
      }
      const res = await axios.post(`${BaseUrl}/api/chat/rooms`, payload, UserHelper.axiosConfig())
      const newRoom = res.data.data
      setRooms(prev => [newRoom, ...prev.filter(r => (r.id || r.ID) !== (newRoom.id || newRoom.ID))])
      setActiveRoom(newRoom)
      setIsNewChatModalOpen(false)
      if (window.innerWidth < 768) setIsSidebarOpen(false)
    } catch (err) {
      toast.error("Gagal memulai chat")
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Nama grup dan anggota harus diisi")
      return
    }
    try {
      const payload = {
        name: groupName,
        chat_room_type_id: 2, // Group
        user_ids: selectedUsers
      }
      const res = await axios.post(`${BaseUrl}/api/chat/rooms`, payload, UserHelper.axiosConfig())
      const newRoom = res.data.data
      setRooms(prev => [newRoom, ...prev])
      setActiveRoom(newRoom)
      setIsNewChatModalOpen(false)
      // Reset state
      setGroupName('')
      setSelectedUsers([])
      setIsGroupMode(false)
      if (window.innerWidth < 768) setIsSidebarOpen(false)
      toast.success("Grup berhasil dibuat")
    } catch (err) {
      toast.error("Gagal membuat grup")
    }
  }

  const handleDeleteMessage = async (messageId, mode = 'me') => {
    try {
      await axios.delete(`${BaseUrl}/api/chat/messages/${messageId}?mode=${mode}`, UserHelper.axiosConfig())
      toast.success(mode === 'everyone' ? "Pesan ditarik" : "Pesan dihapus")
      fetchMessages(activeRoom.id || activeRoom.ID)
    } catch (err) {
      toast.error("Gagal menghapus pesan")
    }
  }

  const handleShowDeleteOptions = (msg) => {
    const isMe = (msg.sender_id || msg.SenderID) === currentUserId;
    const msgId = msg.id || msg.ID;

    MySwal.fire({
      title: <span className="text-white">Hapus Pesan?</span>,
      html: <span className="text-gray-400">Pilih bagaimana Anda ingin menghapus pesan ini.</span>,
      icon: 'warning',
      background: '#1e293b',
      showCancelButton: true,
      showDenyButton: isMe,
      confirmButtonText: 'Hapus untuk saya',
      denyButtonText: 'Tarik untuk semua',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#334155',
      denyButtonColor: '#ef4444',
      cancelButtonColor: '#1e293b',
      customClass: {
        popup: 'rounded-3xl border border-gray-700 shadow-2xl',
        confirmButton: 'rounded-xl px-4 py-2 font-bold text-xs uppercase',
        denyButton: 'rounded-xl px-4 py-2 font-bold text-xs uppercase',
        cancelButton: 'rounded-xl px-4 py-2 font-bold text-xs uppercase',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteMessage(msgId, 'me')
      } else if (result.isDenied) {
        handleDeleteMessage(msgId, 'everyone')
      }
    })
  }

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const getRoomName = (room) => {
    if (room.chat_room_type_id === 2) return room.name
    // For private, find the other member
    const otherMember = room.members?.find(m => (m.user_id || m.UserID) !== currentUserId)
    const otherUser = otherMember?.user || otherMember?.User
    return otherUser?.username || otherUser?.nama_lengkap?.split(' ')[0] || "Private Chat"
  }

  const getProfilePic = (userData) => {
    const picPath = userData?.berkas?.find(b => b.jenis === 'foto_profil')?.path
    return picPath ? `${BaseUrl}${picPath}` : null
  }

  const RecommendedItem = ({ item }) => {
    const name = item.master_barang?.nama_brg || item.nama_brg
    const code = item.master_barang?.kode_brg || item.kode_brg
    const itemId = item.id || item.ID
    const isSelected = (selectedItem?.id || selectedItem?.ID) === itemId

    return (
      <div
        onClick={() => setSelectedItem(item)}
        className={`group p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-purple-600/10 border-purple-500 shadow-lg' : 'bg-[#1e293b] border-gray-700 hover:border-gray-500'}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${isSelected ? 'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/20' : 'bg-gray-900 border-gray-800'}`}>
            <HiPlus className={`w-6 h-6 transition-all ${isSelected ? 'text-white' : 'text-gray-600'}`} />
          </div>
          <span className="text-[10px] font-bold text-gray-500 font-mono">{code}</span>
        </div>
        <h4 className="font-bold text-sm text-gray-200 mb-1 line-clamp-1">{name}</h4>
        <p className="text-xs text-gray-500 mb-4">{activeTab === 'inventory' ? `Stok: ${item.stok}` : item.merk?.nama_merk || 'No Brand'}</p>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
            className={`flex-1 ${isSelected ? 'bg-purple-600 shadow-lg shadow-purple-900/40' : 'bg-[#334155]'} hover:bg-purple-500 text-[9px] font-bold py-2 rounded-lg text-white transition-all uppercase tracking-tighter`}
          >
            {isSelected ? 'Terpilih' : 'Pilih Barang'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen h-[100dvh] bg-[#0f172a] text-gray-200 overflow-hidden font-sans relative">
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
        />
      )}

      {/* RIGHT SIDEBAR OVERLAY */}
      {isRightSidebarOpen && (
        <div
          onClick={() => setIsRightSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* LEFT SIDEBAR - Navigation */}
      <div className={`
        absolute md:relative z-40 h-full w-72 bg-[#1e293b] flex flex-col border-r border-gray-800 transition-all duration-300
        ${isSidebarOpen ? 'left-0' : '-left-72 md:left-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 bg-[#334155] hover:bg-purple-600 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg"
              title="Kembali ke Beranda"
            >
              <HiHome className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-500 border border-gray-700 overflow-hidden shadow-inner">
              {getProfilePic(user) ? <img src={getProfilePic(user)} alt="me" className="w-full h-full object-cover" /> : <HiUser className="w-6 h-6" />}
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm text-white truncate leading-none">
                {user?.username || user?.nama_lengkap?.split(' ')[0] || 'ProChat'}
              </h1>
              <span className="text-[10px] text-green-400 flex items-center gap-1 mt-1 font-bold">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="w-full bg-[#334155] hover:bg-purple-600 transition-all py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white"
          >
            <HiPlus /> New Message
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-20">
          <div className="pt-2 pb-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Conversations
          </div>
          {rooms.map(room => {
            const roomId = room.id || room.ID
            const activeRoomId = activeRoom?.id || activeRoom?.ID
            return (
              <div
                key={roomId}
                onClick={() => setActiveRoom(room)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${activeRoomId === roomId ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:bg-[#334155] hover:text-white'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${activeRoomId === roomId ? 'bg-purple-500' : 'bg-gray-800 text-gray-500'}`}>
                  {room.chat_room_type_id === 2 ? (
                    <HiUsers className="w-5 h-5" />
                  ) : (
                    (() => {
                      const otherMember = room.members?.find(m => (m.user_id || m.UserID) !== currentUserId)
                      const pic = getProfilePic(otherMember?.user || otherMember?.User)
                      return pic ? <img src={pic} alt="avatar" className="w-full h-full object-cover" /> : <HiUser className="w-5 h-5" />
                    })()
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-sm truncate">{getRoomName(room)}</p>
                  <p className={`text-[10px] truncate ${activeRoomId === roomId ? 'text-purple-200' : 'text-gray-500'}`}>
                    {room.chat_room_type_id === 2 ? 'Group Chat' : 'Direct Message'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {room.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {room.unread_count}
                    </span>
                  )}
                  {room.proposal_count > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <HiShoppingCart className="w-2.5 h-2.5" /> {room.proposal_count}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </nav>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* CENTER - Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0f172a] relative w-full">
        {activeRoom ? (
          <>
            <header className="h-20 border-b border-gray-800 flex items-center justify-between px-4 md:px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-6">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-gray-800 rounded-lg md:hidden text-gray-400"
                >
                  <HiDotsHorizontal className="w-5 h-5" />
                </button>
                <h2 className="text-sm md:text-xl font-bold text-white tracking-tight truncate max-w-[150px] md:max-w-none">
                  {getRoomName(activeRoom)}
                </h2>
              </div>
              <div className="flex items-center gap-3 md:gap-5 text-gray-400">
                <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
                  <HiShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* CHAT MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth overscroll-contain">
              {messages.map((msg) => {
                const msgId = msg.id || msg.ID
                const senderId = msg.sender_id || msg.SenderID
                const isMe = senderId === currentUserId

                return (
                  <div key={msgId} className={`flex gap-3 md:gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-500 border border-gray-700 overflow-hidden">
                      {(() => {
                        const sender = msg.sender || msg.Sender
                        const pic = getProfilePic(isMe ? user : sender)
                        return pic ? <img src={pic} alt="sender" className="w-full h-full object-cover" /> : <HiUser className="w-5 h-5 md:w-6 md:h-6" />
                      })()}
                    </div>

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] md:text-[11px] font-bold text-gray-400">
                          {isMe ? 'Anda' : ((msg.sender?.username || msg.Sender?.username) || (msg.sender?.nama_lengkap?.split(' ')[0] || msg.Sender?.nama_lengkap?.split(' ')[0]))}
                        </span>
                        <span className="text-[8px] md:text-[9px] text-gray-500">{moment(msg.created_at || msg.CreatedAt).format('HH:mm')}</span>
                      </div>

                      <div className="group relative">
                        {msg.chat_message_type_id === 3 ? (
                          <div
                            onClick={() => handleShowDeleteOptions(msg)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${isMe
                              ? 'bg-purple-900/40 border-purple-500/50 text-white rounded-tr-none'
                              : 'bg-[#1e293b] border-gray-700 text-gray-200 rounded-tl-none'
                              }`}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-purple-600 rounded-lg">
                                <HiShoppingCart className="text-white w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Pengajuan Barang</span>
                            </div>
                            <p className="text-sm font-bold mb-1">{msg.message}</p>
                            <div className="flex gap-2 mt-4">
                              {user?.otoritas_id <= 3 && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleApproveProposal(msg); }}
                                  className="flex-1 bg-green-600 hover:bg-green-700 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); /* Reject logic */ }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all text-gray-300">Reject</button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleShowDeleteOptions(msg)}
                            className={`px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isMe
                              ? 'bg-purple-600 text-white rounded-tr-none shadow-purple-900/20'
                              : 'bg-[#1e293b] text-gray-200 rounded-tl-none border border-gray-700'
                              }`}
                          >
                            {msg.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-8">
              <div className="max-w-4xl mx-auto bg-[#1e293b] rounded-2xl p-2 border border-gray-700 flex items-center gap-2 shadow-2xl focus-within:border-purple-500/50 transition-all">
                <button
                  type="button"
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRightSidebarOpen ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'}`}
                >
                  <HiPlus className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-2 py-2 placeholder-gray-600 text-sm"
                />
                <button type="submit" className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95">
                  <HiPaperAirplane className="rotate-90 w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mb-8 p-3 bg-gray-800 rounded-xl md:hidden text-purple-400"
            >
              <HiChatAlt2 className="w-10 h-10" />
              <p className="text-xs mt-2 font-bold">Buka Chat</p>
            </button>
            <HiChatAlt2 className="w-20 h-20 opacity-10 mb-4 hidden md:block" />
            <p className="text-lg font-medium">Pilih percakapan untuk memulai</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className={`
        fixed lg:relative z-40 h-full bg-[#1e293b] flex flex-col transition-all duration-300 overflow-hidden
        ${isRightSidebarOpen ? 'right-0 w-80 border-l border-gray-800' : '-right-80 w-0 lg:right-0 border-none'}
      `}>
        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Propose Items</h3>
            <button onClick={() => setIsRightSidebarOpen(false)} className="lg:hidden text-gray-500">
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6 border border-gray-800">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === 'assets' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === 'manual' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Manual
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pb-20 overscroll-contain">
            {activeTab === 'manual' ? (
              <div className="space-y-4">
                <div className="bg-gray-900/30 p-4 rounded-2xl border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Nama Barang</label>
                  <input
                    type="text"
                    value={manualItem.nama}
                    onChange={(e) => setManualItem({ ...manualItem, nama: e.target.value })}
                    placeholder="Contoh: Laptop MacBook Pro"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="bg-gray-900/30 p-4 rounded-2xl border border-gray-800">
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Merk / Spesifikasi</label>
                  <input
                    type="text"
                    value={manualItem.merk}
                    onChange={(e) => setManualItem({ ...manualItem, merk: e.target.value })}
                    placeholder="Contoh: Apple M3 16GB"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500 italic p-2">
                  * Gunakan opsi ini jika barang yang Anda usulkan belum terdaftar di sistem.
                </p>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Search items..."
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                {isSearchingItems ? (
                  <div className="py-10 text-center text-xs text-gray-500 animate-pulse">Searching items...</div>
                ) : items.length > 0 ? (
                  items.map(item => (
                    <RecommendedItem key={item.ID} item={item} />
                  ))
                ) : (
                  <div className="py-10 text-center text-xs text-gray-500 italic">No items found.</div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleProposeItem}
            className={`w-full ${(selectedItem || manualItem.nama) ? 'bg-purple-600 shadow-purple-600/20' : 'bg-gray-700 opacity-50 cursor-not-allowed'} hover:bg-purple-700 transition-all py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg`}
          >
            <HiPaperAirplane className="rotate-90 w-4 h-4" /> Propose to Chat
          </button>
        </div>
      </div>

      {/* NEW CHAT MODAL */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {isGroupMode ? 'Create Group' : 'New Message'}
              </h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="text-gray-500 hover:text-white">
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {canCreateGroup && (
                <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                  <button
                    onClick={() => setIsGroupMode(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isGroupMode ? 'bg-[#334155] text-white' : 'text-gray-500'}`}
                  >
                    Private
                  </button>
                  <button
                    onClick={() => setIsGroupMode(true)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isGroupMode ? 'bg-[#334155] text-white' : 'text-gray-500'}`}
                  >
                    Group
                  </button>
                </div>
              )}

              {isGroupMode && (
                <input
                  type="text"
                  placeholder="Nama Group..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              )}

              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                {users.filter(u => {
                  const fullName = u.nama_lengkap || `${u.nama_depan || ''} ${u.nama_belakang || ''}`.trim() || u.username || '';
                  return fullName.toLowerCase().includes(searchUser.toLowerCase());
                }).map(u => (
                  <div
                    key={u.ID}
                    onClick={() => isGroupMode ? toggleUserSelection(u.ID) : startPrivateChat(u)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedUsers.includes(u.ID) ? 'bg-purple-600/20 border border-purple-500/50' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                        {getProfilePic(u) ? <img src={getProfilePic(u)} alt="user" className="w-full h-full object-cover" /> : <HiUser />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.username || u.nama_lengkap?.split(' ')[0]}</p>
                        <p className="text-[10px] text-gray-500">{u.otoritas?.nama || 'Pegawai'}</p>
                      </div>
                    </div>
                    {isGroupMode && selectedUsers.includes(u.ID) && <HiCheckCircle className="text-purple-500" />}
                  </div>
                ))}
              </div>
            </div>

            {isGroupMode && (
              <div className="p-6 bg-gray-900/30 border-t border-gray-800">
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName || selectedUsers.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20"
                >
                  Create Group ({selectedUsers.length} Members)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  )
}

const RecommendedItem = ({ name, price }) => (
  <div className="group">
    <div className="flex items-center justify-between mb-2">
      <h5 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{name}</h5>
      <span className="text-[10px] font-bold text-purple-400">{price}</span>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 bg-[#334155] hover:bg-purple-600 text-[9px] font-bold py-2 rounded-lg text-white transition-all uppercase tracking-tighter">
        Pengadaan
      </button>
      <button className="flex-1 bg-[#334155] hover:bg-blue-600 text-[9px] font-bold py-2 rounded-lg text-white transition-all uppercase tracking-tighter">
        Permintaan
      </button>
    </div>
  </div>
)

export default Chat
