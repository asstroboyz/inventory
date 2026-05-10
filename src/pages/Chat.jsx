import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  HiChatAlt2, HiUsers, HiShoppingCart,
  HiSearch, HiPlus, HiPaperAirplane,
  HiCheckCircle, HiDotsHorizontal, HiUser, HiX, HiHome, HiArrowLeft, HiTrash,
  HiReply, HiDuplicate, HiShare, HiStar, HiBookmark, HiChevronDown, HiPhotograph, HiDocumentText, HiOutlinePlus,
  HiInformationCircle, HiUserGroup, HiLogout, HiCheck
} from 'react-icons/hi'
import { UserHelper } from '../helper/user'
import { BaseUrl } from '../helper/api'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CHAT_CONSTANTS, canAccessFeature, canApproveReject } from '../helpers/chat'

const MySwal = withReactContent(Swal)

const formatDateSeparator = (dateString) => {
  const msgDate = moment(dateString).startOf('day')
  const today = moment().startOf('day')
  const diffDays = today.diff(msgDate, 'days')

  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[msgDate.day()]
  }
  return msgDate.format('DD/MM/YYYY')
}

let notifAudio = null;
let audioUnlocked = false;

const unlockAudio = () => {
  if (audioUnlocked) return;
  if (!notifAudio) {
    notifAudio = new Audio('/sound/notif.wav');
    notifAudio.volume = 0.7;
  }
  
  // Mainkan secara diam-diam dan langsung pause untuk membuka izin browser
  const playPromise = notifAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      notifAudio.pause();
      notifAudio.currentTime = 0;
      audioUnlocked = true;
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    }).catch(err => {
      console.log("Audio unlock failed:", err);
    });
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
}

const playNotificationSound = () => {
  try {
    if (!notifAudio) {
      notifAudio = new Audio('/sound/notif.wav')
      notifAudio.volume = 0.7
    }
    notifAudio.currentTime = 0;
    notifAudio.play().catch(err => console.log("Audio play blocked by browser:", err))
  } catch (err) {
    console.error("Error playing sound:", err)
  }
}

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
  const [replyTo, setReplyTo] = useState(null)
  const [activeMenuId, setActiveMenuId] = useState(null)

  // Advanced Chat Actions State
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState([])
  const [starredMessageIds, setStarredMessageIds] = useState([])
  const [pinnedMessageIds, setPinnedMessageIds] = useState([])
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false)
  const [messageToForward, setMessageToForward] = useState(null)
  const [contextMenu, setContextMenu] = useState(null) // { x, y, room }
  const [highlightedMessageId, setHighlightedMessageId] = useState(null)

  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const user = UserHelper.getUser()
  const currentUserId = user?.id || user?.ID
  const messagesEndRef = useRef(null)

  const isAuthorized = canAccessFeature(user)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/chat/rooms`, UserHelper.axiosConfig())
      const roomData = res.data.data || []
      setRooms(roomData)
    } catch (e) {
      console.error("Gagal mengambil room", e)
    }
  }, [currentUserId])

  const fetchUsers = useCallback(async () => {
    try {
      const user = UserHelper.getUser()
      const currentId = Number(user?.id || user?.ID)

      const res = await axios.get(
        `${BaseUrl}/api/user/`,
        UserHelper.axiosConfig()
      )

      const allUsers = Array.isArray(res.data?.data) ? res.data.data : []

      const otherUsers = allUsers
        .filter((u) => {
          const userId = Number(u?.id ?? u?.ID)
          return Number.isFinite(userId) && userId !== currentId
        })
        .sort((a, b) => {
          const nameA = String(a?.nama_lengkap ?? a?.username ?? "").toLowerCase()
          const nameB = String(b?.nama_lengkap ?? b?.username ?? "").toLowerCase()

          return nameA.localeCompare(nameB)
        })

      setUsers(otherUsers)
    } catch (error) {
      console.error("Gagal mengambil user:", error)
      setUsers([])
    }
  }, [])

  const fetchItems = useCallback(async () => {
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
    } catch (e) {
      console.error("Gagal mencari barang", e)
    } finally {
      setIsSearchingItems(false)
    }
  }, [activeTab, searchItem])

  const fetchMessages = useCallback(async (roomId) => {
    if (!roomId) return
    try {
      const res = await axios.get(`${BaseUrl}/api/chat/rooms/${roomId}/messages`, UserHelper.axiosConfig())
      const newMessages = res.data.data?.reverse() || []
      setMessages(newMessages)

      // Hilangkan badge unread count secara lokal karena di backend sudah ditandai terbaca
      setRooms(prevRooms => prevRooms.map(room => {
        if ((room.id || room.ID) === roomId) {
          return { ...room, unread_count: 0 }
        }
        return room
      }))
    } catch (e) {
      console.error("Gagal mengambil pesan", e)
    }
  }, [])

  useEffect(() => {
    if (activeRoom) {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
      fetchMessages(activeRoom.id || activeRoom.ID)
    }
  }, [activeRoom, fetchMessages])

  useEffect(() => {
    fetchRooms()
    fetchUsers()
  }, [fetchRooms, fetchUsers])

  // Search items when tab or search term changes
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // WebSocket Integration for real-time chat
  useEffect(() => {
    if (!BaseUrl) return
    let socket = null;
    let reconnectTimer = null;
    let syncInterval = null;

    const connectWS = () => {
      const wsUrl = BaseUrl.replace('http', 'ws').replace('https', 'wss') + '/api/ws'
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('Connected to WebSocket')
        // Sync rooms on reconnect just in case we missed events
        fetchRooms()
      }

      socket.onclose = () => {
        console.log('Disconnected from WebSocket, trying to reconnect...')
        reconnectTimer = setTimeout(() => {
          connectWS()
        }, 3000)
      }

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.event === 'new_message') {
            const newMessageData = payload.data
            const isMe = String(newMessageData.sender_id || newMessageData.SenderID) === String(currentUserId);
            
            if (activeRoom && String(activeRoom.id || activeRoom.ID) === String(newMessageData.room_id)) {
              fetchMessages(activeRoom.id || activeRoom.ID)
              if (!isMe) {
                const newMsgId = newMessageData.id || newMessageData.ID;
                setHighlightedMessageId(String(newMsgId));
                
                const sender = newMessageData.sender || newMessageData.Sender || {};
                const senderName = sender.nama_lengkap || sender.username || 'Seseorang';
                const rawMsg = newMessageData.message || '';
                const cleanMsg = rawMsg.replace('[Forwarded]:', '').trim();
                const truncatedMsg = cleanMsg.length > 30 ? cleanMsg.substring(0, 30) + '...' : cleanMsg;

                toast(
                  <div className="flex flex-col min-w-[150px]">
                    <span className="font-bold text-xs text-purple-400">{senderName}</span>
                    <span className="text-[10px] text-gray-300 mt-0.5">{truncatedMsg || 'Mengirim lampiran'}</span>
                  </div>, 
                  { duration: 2000, icon: '💬', style: { background: '#1e293b', color: '#fff', borderRadius: '12px', border: '1px solid #334155' } }
                );
                playNotificationSound();

                setTimeout(() => {
                  setHighlightedMessageId((prev) => prev === String(newMsgId) ? null : prev);
                }, 2000);
              }
            } else if (!isMe) {
              const sender = newMessageData.sender || newMessageData.Sender || {};
              const senderName = sender.nama_lengkap || sender.username || 'Seseorang';
              const rawMsg = newMessageData.message || '';
              const cleanMsg = rawMsg.replace('[Forwarded]:', '').trim();
              const truncatedMsg = cleanMsg.length > 30 ? cleanMsg.substring(0, 30) + '...' : cleanMsg;

              toast(
                <div className="flex flex-col min-w-[150px]">
                  <span className="font-bold text-xs text-purple-400">{senderName}</span>
                  <span className="text-[10px] text-gray-300 mt-0.5">{truncatedMsg || 'Mengirim lampiran'}</span>
                </div>, 
                { duration: 2000, icon: '🔔', style: { background: '#1e293b', color: '#fff', borderRadius: '12px', border: '1px solid #334155' } }
              );
              playNotificationSound();
            }
            fetchRooms()
          }
          if (payload.event === 'delete_message') {
            if (activeRoom) fetchMessages(activeRoom.id || activeRoom.ID)
            fetchRooms()
          }
          if (payload.event === 'read_receipt') {
            fetchRooms()
          }
        } catch (err) {
          console.error('WS Message Error:', err)
        }
      }
    }

    connectWS();

    // Fallback sync every 15 seconds to ensure UI is completely accurate
    // even if websockets drop messages or fail to reconnect immediately
    syncInterval = setInterval(() => {
      fetchRooms()
    }, 15000);

    return () => {
      if (socket) {
        socket.onclose = null; // prevent reconnect loop on unmount
        socket.close();
      }
      clearTimeout(reconnectTimer);
      clearInterval(syncInterval);
    }
  }, [activeRoom, currentUserId, fetchRooms, fetchMessages])

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null)
      setContextMenu(null)
    }
    if (activeMenuId || contextMenu) {
      const timer = setTimeout(() => {
        window.addEventListener('click', handleClickOutside)
        window.addEventListener('contextmenu', handleClickOutside)
      }, 0)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('click', handleClickOutside)
        window.removeEventListener('contextmenu', handleClickOutside)
      }
    }
  }, [activeMenuId, contextMenu])

  const handleContextMenu = (e, room) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      room
    })
  }

  const handleForwardMessage = async (targetRoom) => {
    if (!messageToForward) return
    const targetRoomId = targetRoom.id || targetRoom.ID
    try {
      // Clean existing prefix to avoid [Forwarded]: [Forwarded]:
      const cleanMessage = messageToForward.message.startsWith('[Forwarded]:')
        ? messageToForward.message.replace('[Forwarded]:', '').trim()
        : messageToForward.message;

      const payload = {
        room_id: targetRoomId,
        message: `[Forwarded]: ${cleanMessage}`,
        chat_message_type_id: messageToForward.chat_message_type_id || 1
      }
      await axios.post(`${BaseUrl}/api/chat/messages`, payload, UserHelper.axiosConfig())
      toast.success(`Pesan diteruskan ke ${getRoomName(targetRoom)}`)
      setIsForwardModalOpen(false)
      setMessageToForward(null)
      if (activeRoom && (activeRoom.id || activeRoom.ID) === targetRoomId) {
        fetchMessages(targetRoomId)
      }
    } catch (err) {
      toast.error("Gagal meneruskan pesan")
    }
  }

  const toggleMessageSelection = (msgId) => {
    if (selectedMessageIds.includes(msgId)) {
      setSelectedMessageIds(selectedMessageIds.filter(id => id !== msgId))
    } else {
      setSelectedMessageIds([...selectedMessageIds, msgId])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMessageIds.length === 0) return

    MySwal.fire({
      title: 'Hapus terpilih?',
      text: `Anda akan menghapus ${selectedMessageIds.length} pesan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      background: '#1e293b',
      confirmButtonColor: '#ef4444'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(selectedMessageIds.map(id =>
            axios.delete(`${BaseUrl}/api/chat/messages/${id}?mode=me`, UserHelper.axiosConfig())
          ))
          toast.success("Pesan-pesan berhasil dihapus")
          setSelectedMessageIds([])
          setIsSelectMode(false)
          fetchMessages(activeRoom.id || activeRoom.ID)
        } catch (err) {
          toast.error("Beberapa pesan gagal dihapus")
        }
      }
    })
  }

  const handleSendMessage = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation()

    if (!newMessage.trim() || !activeRoom) return

    const tempMsg = newMessage
    const currentReply = replyTo
    const roomId = activeRoom.id || activeRoom.ID

    setNewMessage('')

    try {
      const cleanReplyText = currentReply && currentReply.message.startsWith('> ')
        ? currentReply.message.split('\n\n').slice(1).join('\n\n')
        : currentReply?.message;

      const payload = {
        room_id: roomId,
        message: currentReply ? `> ${cleanReplyText}\n\n${tempMsg}` : tempMsg,
        chat_message_type_id: 1 // Text
      }

      const res = await axios.post(`${BaseUrl}/api/chat/messages`, payload, UserHelper.axiosConfig())

      if (res.status === 200 || res.status === 201) {
        setReplyTo(null)
        fetchMessages(roomId)
      } else {
        throw new Error("Gagal mengirim")
      }
    } catch (err) {
      setNewMessage(tempMsg)
      if (currentReply) setReplyTo(currentReply)
      toast.error("Gagal mengirim pesan")
    }
  }

  const handleProposeItem = async () => {
    if (!activeRoom) return

    let payload = {
      room_id: activeRoom.id || activeRoom.ID,
      chat_message_type_id: 3, // Cart / Transaction Type
    }

    if (activeTab === 'manual') {
      if (!manualItem.nama) {
        toast.error("Nama barang harus diisi")
        return
      }
      payload.message = `PROPOSAL (MANUAL): ${manualItem.nama} ${manualItem.merk ? `[${manualItem.merk}]` : ''}`
      payload.reference_id = null
      payload.reference_type = 'manual'
    } else {
      if (!selectedItem) {
        toast.error("Pilih barang terlebih dahulu")
        return
      }
      const itemName = selectedItem.master_barang?.nama_brg || selectedItem.nama_brg
      const itemCode = selectedItem.master_barang?.kode_brg || selectedItem.kode_brg
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
      console.error(err)
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
    } catch (error) {
      console.error(error)
      toast.error("Gagal menyetujui usulan")
    }
  }

  const handleRejectProposal = async (msg) => {
    if (!isAuthorized) {
      toast.error("Hanya Admin/Pimpinan yang bisa menolak")
      return
    }

    MySwal.fire({
      title: 'Tolak Usulan?',
      text: "Usulan ini akan dihapus permanen dari percakapan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const msgId = msg.id || msg.ID
          await axios.delete(`${BaseUrl}/api/chat/messages/${msgId}?mode=everyone`, UserHelper.axiosConfig())
          toast.success("Usulan berhasil ditolak")
          fetchMessages(activeRoom.id || activeRoom.ID)
        } catch (error) {
          console.error("Reject Error:", error)
          toast.error("Gagal menolak usulan")
        }
      }
    })
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
    } catch (error) {
      console.error(error)
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
    } catch (error) {
      console.error(error)
      toast.error("Gagal membuat grup")
    }
  }

  const handleDeleteMessage = async (messageId, mode = 'me') => {
    try {
      await axios.delete(`${BaseUrl}/api/chat/messages/${messageId}?mode=${mode}`, UserHelper.axiosConfig())
      toast.success(mode === 'everyone' ? "Pesan ditarik" : "Pesan dihapus")
      fetchMessages(activeRoom.id || activeRoom.ID)
    } catch (error) {
      console.error(error)
      toast.error("Gagal menghapus pesan")
    }
  }

  const handleDeleteRoom = async (roomId) => {
    MySwal.fire({
      title: 'Hapus Chat/Group?',
      text: "Seluruh pesan dalam percakapan ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BaseUrl}/api/chat/rooms/${roomId}`, UserHelper.axiosConfig())
          toast.success("Percakapan berhasil dihapus")
          setActiveRoom(null)
          fetchRooms()
        } catch (error) {
          console.error(error)
          toast.error("Gagal menghapus percakapan")
        }
      }
    })
  }

  const handleLeaveRoom = async (roomId) => {
    MySwal.fire({
      title: 'Keluar dari Group?',
      text: "Anda tidak akan bisa melihat pesan baru dari group ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${BaseUrl}/api/chat/rooms/${roomId}/leave`, {}, UserHelper.axiosConfig())
          toast.success("Berhasil keluar dari group")
          setActiveRoom(null)
          fetchRooms()
        } catch (error) {
          console.error(error)
          toast.error("Gagal keluar dari group")
        }
      }
    })
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
    return otherUser?.nama_lengkap || otherUser?.username || "Private Chat"
  }

  const getRoomPic = (room) => {
    if (room.chat_room_type_id === 2) return null
    const otherMember = room.members?.find(m => (m.user_id || m.UserID) !== currentUserId)
    const otherUser = otherMember?.user || otherMember?.User
    return getProfilePic(otherUser)
  }

  const getProfilePic = (userData) => {
    if (!userData) return CHAT_CONSTANTS.DEFAULT_BOY_AVATAR

    const picPath = userData?.berkas?.find(b => b.jenis === 'foto_profil')?.path
    if (picPath) return `${BaseUrl}${picPath}`

    // Fallback to local gender-based avatars
    const jk = userData.jenis_kelamin || userData.JenisKelamin || 'L'
    if (jk === 'P') return CHAT_CONSTANTS.DEFAULT_GIRL_AVATAR
    return CHAT_CONSTANTS.DEFAULT_BOY_AVATAR
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


  const copyTextFallback = (text) => {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (!success) {
      throw new Error("Copy fallback gagal");
    }
  };

  const handleCopyMessage = async (e, msg) => {
    e.stopPropagation();

    const message = msg?.message || "";

    const textToCopy = message.startsWith("> ")
      ? message.split("\n\n").slice(1).join("\n\n").trim()
      : message.trim();

    if (!textToCopy) {
      toast.error("Pesan kosong");
      setActiveMenuId(null);
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        copyTextFallback(textToCopy);
      }

      toast.success("Pesan disalin");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Gagal menyalin pesan");
    } finally {
      setActiveMenuId(null);
    }
  };
  const handleFileSelect = (type) => {
    setIsAttachmentMenuOpen(false)
    if (type === 'image') {
      imageInputRef.current?.click()
    } else if (type === 'document') {
      fileInputRef.current?.click()
    } else if (type === 'proposal') {
      setIsRightSidebarOpen(true)
    }
  }

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !activeRoom) return

    const formData = new FormData()
    formData.append('file', file)

    const loadingToast = toast.loading(`Mengupload ${file.name}...`)

    try {
      // 1. Upload file ke server
      const res = await axios.post(`${BaseUrl}/api/chat/upload`, formData, {
        ...UserHelper.axiosConfig(),
        headers: {
          ...UserHelper.axiosConfig().headers,
          'Content-Type': 'multipart/form-data'
        }
      })

      const { url, name } = res.data.data

      // 2. Tentukan tipe pesan (2: Gambar, 4: Dokumen)
      const isImage = file.type.startsWith('image/')
      const messageTypeId = isImage ? 2 : 4

      // 3. Kirim sebagai pesan chat
      const payload = {
        room_id: activeRoom.id || activeRoom.ID,
        message: isImage ? `[Gambar]: ${name}` : `[File]: ${name}`,
        chat_message_type_id: messageTypeId,
        attachment_path: url
      }

      await axios.post(`${BaseUrl}/api/chat/messages`, payload, UserHelper.axiosConfig())

      toast.success("File berhasil terkirim", { id: loadingToast })
      fetchMessages(activeRoom.id || activeRoom.ID)
    } catch (err) {
      console.error("Upload Error:", err)
      toast.error("Gagal mengirim file", { id: loadingToast })
    } finally {
      // Reset input
      e.target.value = ''
    }
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
                {user?.nama_lengkap || user?.username || user?.nama_depan}
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
            const isActive = activeRoomId === roomId
            return (
              <div
                key={roomId}
                onClick={() => setActiveRoom(room)}
                onContextMenu={(e) => handleContextMenu(e, room)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:bg-[#334155] hover:text-white'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${isActive ? 'bg-purple-500' : 'bg-gray-800 text-gray-500'}`}>
                  {getRoomPic(room) ? (
                    <img src={getRoomPic(room)} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    room.chat_room_type_id === 2 ? <HiUsers className="w-5 h-5" /> : <HiUser className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-sm truncate">{getRoomName(room)}</p>
                  <p className={`text-[10px] truncate ${isActive ? 'text-purple-200' : 'text-gray-500'}`}>
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

      {/* CENTER - Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0f172a] relative w-full">
        {activeRoom ? (
          <>
            <header className="h-20 border-b border-gray-800 flex items-center justify-between px-4 md:px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
              {isSelectMode ? (
                <div className="flex-1 flex items-center justify-between animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setIsSelectMode(false); setSelectedMessageIds([]); }} className="text-gray-400 hover:text-white">
                      <HiX className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-white">{selectedMessageIds.length} terpilih</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleBulkDelete} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                      <HiTrash className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() => {
                        setActiveRoom(null)
                        setIsSidebarOpen(true)
                      }}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all group"
                      title="Tutup Chat"
                    >
                      <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    </button>
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="p-2 bg-gray-800 rounded-lg md:hidden text-gray-400"
                    >
                      <HiDotsHorizontal className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                        {getRoomPic(activeRoom) ? (
                          <img src={getRoomPic(activeRoom)} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <HiUser className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <h2 className="text-sm md:text-xl font-bold text-white tracking-tight truncate max-w-[150px] md:max-w-none">
                        {getRoomName(activeRoom)}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-5 text-gray-400">
                    <button
                      onClick={() => { setActiveTab('info'); setIsRightSidebarOpen(true); }}
                      className={`p-2 rounded-lg transition-all ${activeTab === 'info' && isRightSidebarOpen ? 'bg-purple-600 text-white' : 'hover:bg-gray-800'}`}
                    >
                      <HiInformationCircle className="w-5 h-5" />
                    </button>
                    {isAuthorized && (
                      <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
                        <HiShoppingCart className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </header>

            {/* CHAT MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth overscroll-contain">
              {messages.map((msg, index) => {
                const msgId = msg.id || msg.ID
                const senderId = msg.sender_id || msg.SenderID
                const isMe = senderId === currentUserId

                // Ambil data room terbaru dari state rooms
                const currentRoomData = rooms.find(r => (r.id || r.ID) === (activeRoom?.id || activeRoom?.ID)) || activeRoom
                // Cek apakah ada member lain yang last_read_message_id nya >= msgId
                const isRead = currentRoomData?.members?.some(m => 
                  String(m.user_id || m.UserID) !== String(currentUserId) && 
                  (m.last_read_message_id || m.LastReadMessageID || 0) >= msgId
                ) || false;

                let showDateSeparator = false
                const currentDate = moment(msg.created_at || msg.CreatedAt).startOf('day')
                if (index === 0) {
                  showDateSeparator = true
                } else {
                  const prevMsg = messages[index - 1]
                  const prevDate = moment(prevMsg.created_at || prevMsg.CreatedAt).startOf('day')
                  if (!currentDate.isSame(prevDate)) {
                    showDateSeparator = true
                  }
                }

                return (
                  <div key={msgId} className="flex flex-col space-y-6">
                    {showDateSeparator && (
                      <div className="flex justify-center my-2">
                        <div className="bg-[#1e293b] border border-gray-700 text-gray-400 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                          {formatDateSeparator(msg.created_at || msg.CreatedAt)}
                        </div>
                      </div>
                    )}
                    <div className={`flex gap-3 md:gap-4 ${isMe ? 'flex-row-reverse' : ''} ${isSelectMode ? 'cursor-pointer hover:bg-purple-600/5' : ''} ${String(highlightedMessageId) === String(msgId) ? 'ring-2 ring-purple-500 bg-purple-600/20 rounded-2xl p-2 transition-all duration-500' : 'transition-all duration-500'}`} onClick={() => isSelectMode && toggleMessageSelection(msgId)}>
                    {isSelectMode && (
                      <div className="flex items-center justify-center px-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMessageIds.includes(msgId) ? 'bg-purple-600 border-purple-500' : 'border-gray-600'}`}>
                          {selectedMessageIds.includes(msgId) && <HiCheckCircle className="text-white w-4 h-4" />}
                        </div>
                      </div>
                    )}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-500 border border-gray-700 overflow-hidden">
                      {(() => {
                        const sender = msg.sender || msg.Sender
                        const pic = getProfilePic(isMe ? user : sender)
                        return pic ? <img src={pic} alt="sender" className="w-full h-full object-cover" /> : <HiUser className="w-5 h-5 md:w-6 md:h-6" />
                      })()}
                    </div>

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[90%] md:max-w-[75%] lg:max-w-[65%]`}>
                      {!isMe && (
                        <span className="text-[10px] md:text-[11px] font-bold text-purple-400 mb-1 px-1">
                          {((msg.sender?.username || msg.Sender?.username) || (msg.sender?.nama_lengkap || msg.Sender?.nama_lengkap))}
                        </span>
                      )}

                      <div className="group relative">
                        {msg.chat_message_type_id === 3 ? (
                          <div
                            onClick={() => setReplyTo(msg)}
                            className={`group relative p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-lg ${isMe
                              ? 'bg-purple-900/60 border-purple-500/30 text-white rounded-tr-none shadow-purple-900/10'
                              : 'bg-[#1e293b] border-gray-700 text-gray-200 rounded-tl-none'
                              }`}>
                            {msg.message?.startsWith('[Forwarded]:') && (
                              <div className="flex items-center gap-1.5 mb-2 text-white/40 italic">
                                <HiShare className="w-2.5 h-2.5" />
                                <span className="text-[9px]">Forwarded</span>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-900/20">
                                <HiShoppingCart className="text-white w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Pengajuan Barang</span>
                            </div>
                            {pinnedMessageIds.includes(msgId) && (
                              <div className="flex items-center gap-1 mb-1 opacity-80">
                                <HiBookmark className="w-2.5 h-2.5 text-blue-400" />
                                <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Pinned</span>
                              </div>
                            )}
                            <p className="text-sm font-bold mb-1 whitespace-pre-wrap leading-relaxed">
                              {msg.message?.startsWith('[Forwarded]:') ? msg.message.replace('[Forwarded]:', '').trim() : msg.message}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              {!isMe && canApproveReject(user) && (
                                <div className="flex gap-2 flex-1 mr-4">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleApproveProposal(msg); }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-md"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRejectProposal(msg); }}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all text-gray-400 border border-gray-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              <div className={`flex items-center gap-1.5 shrink-0 ${isMe ? 'w-full justify-end' : ''}`}>
                                {starredMessageIds.includes(msgId) && <HiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                <span className="text-[9px] text-gray-500 font-medium">{moment(msg.created_at || msg.CreatedAt).format('HH:mm')}</span>
                                {isMe && (
                                  <div className="flex -space-x-1.5">
                                    <HiCheck className={`w-3 h-3 ${isRead ? 'text-blue-400' : 'text-gray-500'}`} />
                                    <HiCheck className={`w-3 h-3 ${isRead ? 'text-blue-400' : 'text-gray-500'}`} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* WhatsApp Style Action Menu */}
                            <div className={`absolute top-1 ${isMe ? 'left-[-32px]' : 'right-[-32px]'} z-30 opacity-0 group-hover:opacity-100 transition-opacity`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === msgId ? null : msgId);
                                }}
                                className="p-1 rounded-full bg-gray-800/90 text-gray-400 hover:text-white shadow-xl backdrop-blur-sm border border-gray-700"
                              >
                                <HiChevronDown className="w-4 h-4" />
                              </button>

                              {activeMenuId === msgId && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} w-48 bg-[#232d36]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200`}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReplyTo(msg);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiReply className="w-4 h-4 text-gray-400" /> Reply
                                  </button>
                                  <button
                                    onClick={(e) => handleCopyMessage(e, msg)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiDuplicate className="w-4 h-4 text-gray-400" /> Copy
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMessageToForward(msg);
                                      setIsForwardModalOpen(true);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiShare className="w-4 h-4 text-gray-400" /> Forward
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (pinnedMessageIds.includes(msgId)) {
                                        setPinnedMessageIds(pinnedMessageIds.filter(id => id !== msgId));
                                        toast.success("Pin dilepas");
                                      } else {
                                        setPinnedMessageIds([...pinnedMessageIds, msgId]);
                                        toast.success("Pesan disematkan");
                                      }
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiBookmark className={`w-4 h-4 ${pinnedMessageIds.includes(msgId) ? 'text-blue-400' : 'text-gray-400'}`} /> {pinnedMessageIds.includes(msgId) ? 'Unpin' : 'Pin'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (starredMessageIds.includes(msgId)) {
                                        setStarredMessageIds(starredMessageIds.filter(id => id !== msgId));
                                        toast.success("Bintang dihapus");
                                      } else {
                                        setStarredMessageIds([...starredMessageIds, msgId]);
                                        toast.success("Pesan ditandai bintang");
                                      }
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiStar className={`w-4 h-4 ${starredMessageIds.includes(msgId) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} /> {starredMessageIds.includes(msgId) ? 'Unstar' : 'Star'}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setIsSelectMode(true); toggleMessageSelection(msgId); setActiveMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiCheckCircle className="w-4 h-4 text-gray-400" /> Select
                                  </button>
                                  <div className="h-[1px] bg-gray-700/50 my-1 mx-2" />
                                  <button
                                    onClick={() => { handleShowDeleteOptions(msg); setActiveMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiTrash className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setReplyTo(msg)}
                            className={`group relative px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm cursor-pointer transition-all hover:shadow-md ${isMe
                              ? 'bg-purple-600 text-white rounded-tr-none shadow-purple-900/20'
                              : 'bg-[#1e293b] text-gray-200 rounded-tl-none border border-gray-700'
                              }`}
                          >
                            {msg.message?.startsWith('[Forwarded]:') && (
                              <div className="flex items-center gap-1.5 mb-1.5 text-white/40 italic">
                                <HiShare className="w-3 h-3" />
                                <span className="text-[10px]">Forwarded</span>
                              </div>
                            )}

                            {msg.attachment_path && (
                              <div className="mb-2 overflow-hidden rounded-lg">
                                {msg.chat_message_type_id === 2 ? (
                                  <a href={`${BaseUrl}${msg.attachment_path}`} target="_blank" rel="noreferrer">
                                    <img
                                      src={`${BaseUrl}${msg.attachment_path}`}
                                      alt="attachment"
                                      className="max-w-full max-h-60 md:max-h-80 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-500"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={`${BaseUrl}${msg.attachment_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5 hover:bg-black/50 transition-all group"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                      <HiDocumentText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                      <p className="text-[11px] md:text-xs font-bold text-white truncate">{msg.message?.replace('[File]: ', '') || 'Document'}</p>
                                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Download File</p>
                                    </div>
                                  </a>
                                )}
                              </div>
                            )}

                            {(() => {
                              const cleanMsg = msg.message?.startsWith(CHAT_CONSTANTS.FWD_PREFIX)
                                ? msg.message.replace(CHAT_CONSTANTS.FWD_PREFIX, '').trim()
                                : msg.message;

                              if (msg.attachment_path && (cleanMsg.startsWith('[Gambar]:') || cleanMsg.startsWith('[File]:'))) {
                                return null;
                              }

                              return cleanMsg?.startsWith(CHAT_CONSTANTS.REPLY_PREFIX) ? (
                                <div className="flex flex-col gap-2">
                                  <div className={`border-l-4 p-3 rounded-lg text-[11px] italic mb-1 leading-relaxed shadow-inner ${isMe ? 'bg-black/30 border-purple-300 opacity-90' : 'bg-black/40 border-purple-500 opacity-80'
                                    }`}>
                                    {cleanMsg.split('\n\n')[0].substring(CHAT_CONSTANTS.REPLY_PREFIX.length)}
                                  </div>
                                  <div className="whitespace-pre-wrap leading-relaxed">
                                    {cleanMsg.split('\n\n').slice(1).join('\n\n')}
                                  </div>
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap leading-relaxed">{cleanMsg}</div>
                              );
                            })()}

                            <div className="flex items-center justify-end gap-1.5 mt-1.5">
                              {starredMessageIds.includes(msgId) && <HiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                              <span className={`text-[9px] font-medium ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                                {moment(msg.created_at || msg.CreatedAt).format('HH:mm')}
                              </span>
                              {isMe && (
                                <div className="flex -space-x-1.5">
                                  <HiCheck className={`w-3 h-3 ${isRead ? 'text-blue-400' : 'text-purple-300/70'}`} />
                                  <HiCheck className={`w-3 h-3 ${isRead ? 'text-blue-400' : 'text-purple-300/70'}`} />
                                </div>
                              )}
                            </div>

                            {pinnedMessageIds.includes(msgId) && (
                              <div className="flex items-center gap-1 mt-1 opacity-60">
                                <HiBookmark className="w-2 h-2 text-blue-400" />
                                <span className="text-[7px] text-blue-400 font-bold uppercase">Pinned</span>
                              </div>
                            )}

                            {/* WhatsApp Style Action Menu */}
                            <div className={`absolute top-1 ${isMe ? 'left-[-32px]' : 'right-[-32px]'} z-30 opacity-0 group-hover:opacity-100 transition-opacity`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === msgId ? null : msgId);
                                }}
                                className="p-1 rounded-full bg-gray-800/90 text-gray-400 hover:text-white shadow-xl backdrop-blur-sm border border-gray-700"
                              >
                                <HiChevronDown className="w-4 h-4" />
                              </button>

                              {activeMenuId === msgId && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} w-48 bg-[#232d36]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200`}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReplyTo(msg);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiReply className="w-4 h-4 text-gray-400" /> Reply
                                  </button>
                                  <button
                                    onClick={(e) => handleCopyMessage(e, msg)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiDuplicate className="w-4 h-4 text-gray-400" /> Copy
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMessageToForward(msg);
                                      setIsForwardModalOpen(true);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiShare className="w-4 h-4 text-gray-400" /> Forward
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (starredMessageIds.includes(msgId)) {
                                        setStarredMessageIds(starredMessageIds.filter(id => id !== msgId));
                                        toast.success("Bintang dihapus");
                                      } else {
                                        setStarredMessageIds([...starredMessageIds, msgId]);
                                        toast.success("Pesan ditandai bintang");
                                      }
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiStar className={`w-4 h-4 ${starredMessageIds.includes(msgId) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} /> {starredMessageIds.includes(msgId) ? 'Unstar' : 'Star'}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setIsSelectMode(true); toggleMessageSelection(msgId); setActiveMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-200 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiCheckCircle className="w-4 h-4 text-gray-400" /> Select
                                  </button>
                                  <div className="h-[1px] bg-gray-700/50 my-1 mx-2" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleShowDeleteOptions(msg); setActiveMenuId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-[#101921] transition-colors"
                                  >
                                    <HiTrash className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-8">
              {replyTo && (
                <div className="max-w-4xl mx-auto mb-2 bg-[#1e293b] border-l-4 border-purple-500 p-3 rounded-r-xl flex justify-between items-center animate-in slide-in-from-bottom-2 duration-200">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Membalas {replyTo.sender?.username || 'Pesan'}</p>
                    <p className="text-xs text-gray-400 truncate italic">
                      "{replyTo.message.startsWith('> ') ? replyTo.message.split('\n\n').slice(1).join('\n\n') : replyTo.message}"
                    </p>
                  </div>
                  <button type="button" onClick={() => setReplyTo(null)} className="p-1 hover:bg-gray-700 rounded-full text-gray-500">
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="max-w-4xl mx-auto relative">
                {/* Hidden File Inputs */}
                <input type="file" ref={imageInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" />

                {/* Attachment Menu */}
                {isAttachmentMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-4 w-56 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-4 duration-300">
                    <button
                      type="button"
                      onClick={() => handleFileSelect('image')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <HiPhotograph className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Gambar</p>
                        <p className="text-[10px] text-gray-500">Kirim foto galeri</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileSelect('document')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <HiDocumentText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Dokumen</p>
                        <p className="text-[10px] text-gray-500">PDF, Word, Excel</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileSelect('proposal')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                        <HiShoppingCart className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Usulan Barang</p>
                        <p className="text-[10px] text-gray-500">Cari dari inventaris</p>
                      </div>
                    </button>
                  </div>
                )}

                <div className="bg-[#1e293b] rounded-2xl p-2 border border-gray-700 flex items-center gap-2 shadow-2xl focus-within:border-purple-500/50 transition-all">
                  <button
                    type="button"
                    onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                    className={`p-2 rounded-xl transition-all ${isAttachmentMenuOpen ? 'bg-purple-600 text-white rotate-45' : 'text-gray-400 hover:bg-gray-800'}`}
                  >
                    <HiOutlinePlus className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-2"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-2.5 rounded-xl transition-all ${newMessage.trim() ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500' : 'bg-gray-800 text-gray-600'}`}
                  >
                    <HiPaperAirplane className="w-5 h-5 rotate-90" />
                  </button>
                </div>
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

          <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6 border border-gray-800 overflow-x-auto custom-scrollbar-hide">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'info' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Inv
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'assets' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Cat
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'manual' ? 'bg-[#334155] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Man
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pb-20 overscroll-contain">
            {activeTab === 'info' ? (
              <div className="space-y-6">
                {/* Room Profile */}
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-24 h-24 rounded-3xl bg-gray-800 border-4 border-gray-900 shadow-2xl flex items-center justify-center overflow-hidden mb-4 ring-1 ring-white/5">
                    {getRoomPic(activeRoom) ? (
                      <img src={getRoomPic(activeRoom)} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <HiUserGroup className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white">{getRoomName(activeRoom)}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                    {activeRoom.chat_room_type_id === 2 ? 'Group Chat' : 'Private Conversation'}
                  </p>
                </div>

                {/* Members List (for Group) */}
                {activeRoom.chat_room_type_id === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Members ({activeRoom.members?.length || 0})</h5>
                    </div>
                    <div className="space-y-2">
                      {activeRoom.members?.map(m => {
                        const u = m.user || m.User
                        const isCreator = (activeRoom.created_by || activeRoom.CreatedBy) === (u.id || u.ID)
                        return (
                          <div key={u.id || u.ID} className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-xl border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                              <img src={getProfilePic(u)} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-200 truncate">{u.nama_lengkap || u.username}</p>
                              <p className="text-[9px] text-gray-500 truncate uppercase tracking-tighter">@{u.username}</p>
                            </div>
                            {isCreator && (
                              <span className="text-[8px] bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-purple-500/20">Admin</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Actions Section */}
                <div className="pt-4 space-y-3">
                  <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Settings</h5>

                  {activeRoom.chat_room_type_id === 1 ? (
                    <button
                      onClick={() => handleDeleteRoom(activeRoom.id || activeRoom.ID)}
                      className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all border border-red-500/20 group"
                    >
                      <HiTrash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <p className="text-xs font-bold">Hapus Chat</p>
                        <p className="text-[9px] opacity-60">Bersihkan semua pesan</p>
                      </div>
                    </button>
                  ) : (
                    <>
                      {(activeRoom.created_by || activeRoom.CreatedBy) === currentUserId ? (
                        <button
                          onClick={() => handleDeleteRoom(activeRoom.id || activeRoom.ID)}
                          className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all border border-red-500/20 group"
                        >
                          <HiTrash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <div className="text-left">
                            <p className="text-xs font-bold">Bubarkan Group</p>
                            <p className="text-[9px] opacity-60">Hapus group untuk semua member</p>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLeaveRoom(activeRoom.id || activeRoom.ID)}
                          className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all border border-red-500/20 group"
                        >
                          <HiLogout className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <div className="text-left">
                            <p className="text-xs font-bold">Keluar Group</p>
                            <p className="text-[9px] opacity-60">Anda tidak akan menerima pesan lagi</p>
                          </div>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : activeTab === 'manual' ? (
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
              {isAuthorized && (
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
      {/* FORWARD MODAL */}
      {isForwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Forward Message</h3>
              <button onClick={() => setIsForwardModalOpen(false)} className="text-gray-500 hover:text-white"><HiX className="w-6 h-6" /></button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar space-y-2">
              <p className="text-xs text-gray-500 mb-4 px-2 italic">Select a conversation to forward this message.</p>
              {rooms.map(room => (
                <div
                  key={room.id || room.ID}
                  onClick={() => handleForwardMessage(room)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 cursor-pointer transition-all border border-transparent hover:border-gray-700"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
                    {getRoomPic(room) ? <img src={getRoomPic(room)} alt="pic" className="w-full h-full object-cover rounded-lg" /> : (room.chat_room_type_id === 2 ? <HiUsers /> : <HiUser />)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{getRoomName(room)}</p>
                    <p className="text-[10px] text-gray-500">{room.chat_room_type_id === 2 ? 'Group' : 'Private'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* CONTEXT MENU */}
      {contextMenu && (
        <div
          className="fixed z-[9999] w-48 bg-[#232d36]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.room.chat_room_type_id === 1 ? (
            <button
              onClick={() => handleDeleteRoom(contextMenu.room.id || contextMenu.room.ID)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors"
            >
              <HiTrash className="w-4 h-4" /> Hapus Percakapan
            </button>
          ) : (
            <>
              {(contextMenu.room.created_by || contextMenu.room.CreatedBy) === currentUserId ? (
                <button
                  onClick={() => handleDeleteRoom(contextMenu.room.id || contextMenu.room.ID)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors"
                >
                  <HiTrash className="w-4 h-4" /> Bubarkan Group
                </button>
              ) : (
                <button
                  onClick={() => handleLeaveRoom(contextMenu.room.id || contextMenu.room.ID)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors"
                >
                  <HiTrash className="w-4 h-4" /> Keluar Group
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Chat
