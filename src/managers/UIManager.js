export class UIManager {
    constructor() {
        this.appContainer = null
        this.currentPage = null
        this.notifications = []
    }
    
    init() {
        this.appContainer = document.getElementById('app')
        this.createNotificationContainer()
    }
    
    renderPage(page) {
        if (this.currentPage) {
            this.currentPage.destroy?.()
        }
        
        this.currentPage = page
        this.appContainer.innerHTML = ''
        
        const pageElement = page.render()
        this.appContainer.appendChild(pageElement)
        
        // Initialize page
        page.init?.()
    }
    
    createNotificationContainer() {
        const container = document.createElement('div')
        container.id = 'notifications'
        container.className = 'fixed top-4 right-4 z-50 space-y-2'
        document.body.appendChild(container)
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div')
        const id = Date.now()
        
        const typeClasses = {
            success: 'bg-green-500 border-green-400',
            error: 'bg-red-500 border-red-400',
            warning: 'bg-yellow-500 border-yellow-400',
            info: 'bg-neon-cyan border-neon-cyan text-black'
        }
        
        notification.className = `
            ${typeClasses[type]} border px-4 py-3 rounded-lg shadow-lg
            transform transition-all duration-300 translate-x-full opacity-0
            max-w-sm font-tech font-medium
        `
        notification.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="ml-4 text-lg font-bold hover:opacity-70">×</button>
            </div>
        `
        
        const container = document.getElementById('notifications')
        container.appendChild(notification)
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0')
        }, 100)
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('translate-x-full', 'opacity-0')
                setTimeout(() => notification.remove(), 300)
            }, duration)
        }
        
        return id
    }
    
    showSuccess(message, duration = 5000) {
        return this.showNotification(message, 'success', duration)
    }
    
    showError(message, duration = 7000) {
        return this.showNotification(message, 'error', duration)
    }
    
    showWarning(message, duration = 6000) {
        return this.showNotification(message, 'warning', duration)
    }
    
    showInfo(message, duration = 5000) {
        return this.showNotification(message, 'info', duration)
    }
    
    showLoading(message = 'Loading...') {
        const overlay = document.createElement('div')
        overlay.id = 'loading-overlay'
        overlay.className = `
            fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
            backdrop-blur-sm
        `
        overlay.innerHTML = `
            <div class="cyber-card text-center">
                <div class="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="neon-text text-lg">${message}</p>
            </div>
        `
        
        document.body.appendChild(overlay)
        return overlay
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay')
        if (overlay) {
            overlay.remove()
        }
    }
    
    createModal(content, options = {}) {
        const modal = document.createElement('div')
        modal.className = `
            fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
            backdrop-blur-sm
        `
        
        const modalContent = document.createElement('div')
        modalContent.className = `
            cyber-card max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto
            ${options.className || ''}
        `
        
        if (options.title) {
            modalContent.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="neon-text text-xl font-bold">${options.title}</h2>
                    <button class="text-neon-cyan hover:text-white text-2xl font-bold" onclick="this.closest('.fixed').remove()">×</button>
                </div>
                <div class="modal-body">${content}</div>
            `
        } else {
            modalContent.innerHTML = content
        }
        
        modal.appendChild(modalContent)
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove()
            }
        })
        
        document.body.appendChild(modal)
        return modal
    }
}
